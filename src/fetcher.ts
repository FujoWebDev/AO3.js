let fetcher: typeof globalThis.fetch | null = null;

export const getFetcher = () => {
  return fetcher ?? globalThis.fetch;
};

export const setFetcher = (newFetcher: typeof globalThis.fetch) => {
  fetcher = newFetcher;
};

export interface RetryOptions {
  /** How many times to retry server errors (5xx) and network errors. Defaults to 3. */
  maxRetries?: number;
  /**
   * How many times to retry rate limits (429), counted separately from
   * maxRetries. Defaults to 10.
   */
  maxRateLimitRetries?: number;
  /**
   * The first backoff delay, doubled after each failure. Only used when the
   * server doesn't say how long to wait. Defaults to 1000 (1 second).
   */
  baseDelayMs?: number;
  /**
   * The longest delay withRetry picks on its own, when the server doesn't send
   * Retry-After. Defaults to 180000 (3 minutes).
   */
  maxDelayMs?: number;
  /**
   * The longest Retry-After to wait out. If the server asks for a longer wait,
   * withRetry returns that response instead of waiting. Defaults to no limit.
   */
  maxRetryAfterMs?: number;
  /** Called before each wait, for example to log what's happening. `attempt` counts all retries so far. */
  onRetry?: (details: {
    attempt: number;
    delayMs: number;
    response?: Response;
    error?: unknown;
  }) => void;
}

/**
 * Turns a Retry-After header into milliseconds. The header is either a number
 * of seconds or an HTTP date. Returns null when there's nothing usable.
 */
export const getRetryAfterMs = (
  header: string | null,
  now = Date.now(),
): number | null => {
  if (!header?.trim()) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - now);
  return null;
};

type RetryKind = "rateLimit" | "error";

// Rate limits (429) and server errors (5xx) may clear up if we ask again.
const isRetryableStatus = (status: number) => status === 429 || status >= 500;

// Which retry limit an attempt counts against. A missing response means a
// network error.
const getRetryKind = (response?: Response): RetryKind =>
  response?.status === 429 ? "rateLimit" : "error";

// How long to wait before the next attempt: the server's Retry-After if it
// sent one, otherwise a backoff that doubles with each retry, up to maxDelayMs.
const getNextDelayMs = ({
  retryAfterMs,
  retryNumber,
  baseDelayMs,
  maxDelayMs,
}: {
  retryAfterMs: number | null;
  retryNumber: number;
  baseDelayMs: number;
  maxDelayMs: number;
}) => {
  if (retryAfterMs !== null) return retryAfterMs;
  const backoff = Math.min(baseDelayMs * 2 ** (retryNumber - 1), maxDelayMs);
  // Wait a random amount between half and all of it, so many clients
  // don't all retry at the same moment.
  return backoff / 2 + (Math.random() * backoff) / 2;
};

const wait = (ms: number, signal?: AbortSignal | null) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal!.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });

/**
 * Wraps a fetch function so it retries rate limits (429), server errors (5xx)
 * and network errors. It waits as long as the server's Retry-After header asks,
 * and otherwise backs off exponentially. Once a limit runs out, it returns the 
 * last response or rethrows the last error.
 */
export const withRetry = (
  baseFetcher: typeof globalThis.fetch,
  {
    maxRetries = 3,
    maxRateLimitRetries = 10,
    baseDelayMs = 1000,
    maxDelayMs = 180_000,
    maxRetryAfterMs = Infinity,
    onRetry,
  }: RetryOptions = {},
): typeof globalThis.fetch => {
  return async (input, init) => {
    const signal =
      init?.signal ?? (input instanceof Request ? input.signal : undefined);

    const limits = { rateLimit: maxRateLimitRetries, error: maxRetries };
    const occurrences = { rateLimit: 0, error: 0 };

    while (true) {
      let response: Response | undefined;
      let error: unknown;
      try {
        // A Request's body can only be read once, so each attempt sends a copy.
        response = await baseFetcher(
          input instanceof Request ? input.clone() : input,
          init,
        );
      } catch (e) {
        if (signal?.aborted) throw e;
        error = e;
      }

      // Success, or an error retrying won't fix (404, 403…)
      if (response && !isRetryableStatus(response.status)) {
        return response;
      }

      const kind = getRetryKind(response);
      const retryAfterMs = getRetryAfterMs(
        response?.headers.get("retry-after") ?? null,
      );
      const isFinalAttempt =
        occurrences[kind] >= limits[kind] ||
        (retryAfterMs !== null && retryAfterMs > maxRetryAfterMs);
      if (isFinalAttempt) {
        if (!response) throw error; // network error, out of retries
        return response; // 429 or 5xx, out of retries or wait too long
      }

      // Free the connection, since nobody will read this body.
      await response?.body?.cancel().catch(() => { });

      occurrences[kind] += 1;
      const delayMs = getNextDelayMs({
        retryAfterMs,
        retryNumber: occurrences[kind],
        baseDelayMs,
        maxDelayMs,
      });

      onRetry?.({
        attempt: occurrences.rateLimit + occurrences.error,
        delayMs,
        response,
        error,
      });
      await wait(delayMs, signal);
    }
  };
};

export interface CacheOptions {
  /** How long a cached page stays fresh. Defaults to 300000 (5 minutes). */
  ttlMs?: number;
  /**
   * How many pages to keep. Past this, the least recently used page is
   * dropped. Defaults to 500.
   */
  maxEntries?: number;
}

interface StoredResponse {
  body: Blob;
  init: ResponseInit & { status: number };
  storedAt: number;
}

const storeResponse = async (response: Response): Promise<StoredResponse> => ({
  // A Blob can't be modified, so every cached copy can share it.
  body: await response.blob(),
  init: {
    status: response.status,
    statusText: response.statusText,
    headers: [...response.headers],
  },
  storedAt: Date.now(),
});

const toResponse = ({ body, init }: StoredResponse) =>
  // Statuses like 204 can't have a body at all, even an empty one.
  new Response(body.size > 0 ? body : null, init);

/**
 * Wraps a fetch function so it keeps successful GET responses in memory and
 * answers repeat requests from there. Wrap it around withRetry, so cached pages
 * don't needlessly retry.
 */
export const withCache = (
  baseFetcher: typeof globalThis.fetch,
  { ttlMs = 5 * 60_000, maxEntries = 500 }: CacheOptions = {},
): typeof globalThis.fetch => {
  const cache = new Map<string, StoredResponse>();
  const inFlight = new Map<string, Promise<StoredResponse>>();

  const storeOrUpdate = (key: string, stored: StoredResponse) => {
    if (stored.init.status < 200 || stored.init.status >= 300) return stored;
    // Re-adding a key keeps its old position, so delete it first.
    cache.delete(key);
    cache.set(key, stored);
    for (const oldestKey of cache.keys()) {
      if (cache.size <= maxEntries) break;
      cache.delete(oldestKey);
    }
    return stored;
  };

  return async (input, init) => {
    const request = new Request(input, init);
    if (request.method !== "GET") return baseFetcher(input, init);
    // Headers change the page AO3 sends back (the adult-content cookie, for
    // one), so they're part of the key.
    const key = JSON.stringify([request.url, ...request.headers]);

    const cached = cache.get(key);
    if (cached && Date.now() - cached.storedAt < ttlMs) {
      return toResponse(storeOrUpdate(key, cached));
    }
    cache.delete(key);

    let pending = inFlight.get(key);
    if (!pending) {
      pending = baseFetcher(input, init)
        .then(storeResponse)
        .then((stored) => storeOrUpdate(key, stored))
        .finally(() => inFlight.delete(key));
      inFlight.set(key, pending);
    }
    return toResponse(await pending);
  };
};
