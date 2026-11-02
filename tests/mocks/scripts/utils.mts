import filenamify from "filenamify";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { withRetry } from "../../../src/fetcher";

// filenamify replaces | with ! which can cause bugs since ! appears naturally in tag names.
// We encode | as !p! (matching existing !d!, !a!, !s! patterns) before filenamify
// so the encoding is always reversible.
export function safeFilenamify(name: string): string {
  return filenamify(name.replace(/\|/g, "!p!"));
}

export function decodeFilename(encodedName: string): string {
  return encodedName
    .replace(/!p!/g, "|") // Pipe
    .replace(/!d!/g, ".") // Period
    .replace(/!a!/g, "&") // Ampersand
    .replace(/!s!/g, "/") // Forward slash
    .replace(/\*a\*/g, "&"); // Alternative ampersand encoding
}

const ARCHIVE_URLS = {
  ao3: "archiveofourown.org",
  superlove: "superlove.sayitditto.net",
};

export class Http404Error extends Error {
  // AO3 still returns content also for 404 pages
  // We return it with the error so our own pages can be consistent
  // with its behavior
  content: string = "";
}

export class HttpStatusError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cloudflare errors (like 525) take longer than a few seconds to clear,
// so errors get 5 attempts and start backing off at 10 seconds.
const retryingFetch = withRetry(fetch, {
  maxRetries: 4,
  baseDelayMs: 10_000,
  onRetry: ({ attempt, delayMs, response, error }) => {
    const reason = response
      ? `status ${response.status}`
      : error instanceof Error
        ? error.message
        : String(error);
    console.log(
      `Retry ${attempt} after ${reason}, waiting ${Math.round(delayMs / 1000)}s...`,
    );
  },
});

export async function downloadWithRetry(url: string) {
  const response = await retryingFetch(url, {
    headers: {
      Cookie: "view_adult=true;",
    },
  });

  if (response.ok) {
    return await response.text();
  }
  if (response.status === 404) {
    // We let 404 errors be handled by the consumers as they wish
    const newError = new Http404Error("404 error returned");
    newError.content = await response.text();
    throw newError;
  }
  throw new HttpStatusError(
    `Failed to download ${url}: ${response.status}`,
    response.status,
  );
}

export function getRootDataDir() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", "data");
}

export function getArchiveDataDir(archive: "ao3" | "superlove" = "ao3") {
  return path.join(getRootDataDir(), archive);
}

const getNormalizedQueryFolder = (searchParams: URLSearchParams) => {
  const entries: string[] = [];
  // Sort the parameters to make the folder name deterministic
  const keys = Array.from(new Set([...searchParams.keys()])).sort();

  for (const key of keys) {
    // Page is used for the page number instead (i.e. 01.html, 02.html, etc.)
    if (key === "page") {
      continue;
    }
    const values = searchParams.getAll(key);
    // Also sort the values of the same keys
    const sortedValues = values.length > 1 ? [...values].sort() : values;
    for (const value of sortedValues) {
      const segment = `${key}=${value == "any" ? "" : value}`;
      entries.push(
        filenamify(segment.toLowerCase(), { replacement: "_", maxLength: 100 }),
      );
    }
  }

  if (entries.length === 0) {
    return "default";
  }

  return entries.join("__");
};

export function getSearchParamsFromQueryPath(
  queryFolder: string,
  filename: string,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (queryFolder !== "default") {
    for (const query of queryFolder.split("__")) {
      const separator = query.indexOf("=");
      if (separator < 0) {
        throw new Error(`Invalid query folder: ${queryFolder}`);
      }
      searchParams.append(query.slice(0, separator), query.slice(separator + 1));
    }
  }
  searchParams.set("page", filename.replace(/\.html$/, ""));
  return searchParams;
}

const getPageFileName = (searchParams: URLSearchParams) => {
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  return `${String(page).padStart(2, "0")}.html`;
};

export const getFilePathForSearchUrl = (parsedUrl: URL) => {
  const folderName = getNormalizedQueryFolder(parsedUrl.searchParams);
  const fileName = getPageFileName(parsedUrl.searchParams);

  // TODO: make this support other search types with time
  return path.join("tag-search", folderName, fileName);
};

// Sorted or paginated user works listings get one folder per query, so they
// don't overwrite the default works.html. Returns null for the default listing,
// which is stored as works.html like any other works page.
const getUserWorksQueryPath = (parsedUrl: URL) => {
  const searchParams = new URLSearchParams(parsedUrl.searchParams);
  // Sorting by revised_at is what AO3 does when no sort is given.
  if (searchParams.get("work_search[sort_column]") === "revised_at") {
    searchParams.delete("work_search[sort_column]");
  }
  const folderName = getNormalizedQueryFolder(searchParams);
  const fileName = getPageFileName(searchParams);
  if (folderName === "default" && fileName === "01.html") {
    return null;
  }
  return path.join(folderName, fileName);
};

const getSearchUrlFromPath = ({
  queryDirectoryName,
  filename,
  archive
}: {
  queryDirectoryName: string;
  filename: string;
  archive: "ao3" | "superlove";
}) => {
  const searchParams = getSearchParamsFromQueryPath(
    queryDirectoryName,
    filename,
  );
  const type = searchParams.get("tag_search[type]");
  if (type !== null) {
    searchParams.set(
      "tag_search[type]",
      type.charAt(0).toUpperCase() + type.slice(1),
    );
  }
  const tagsSearchUrl = new URL("/tags/search", getArchiveUrl(archive));
  tagsSearchUrl.search = searchParams.toString();
  return tagsSearchUrl.href;
};


const getUserWorksUrlFromPath = ({
  queryDirectoryName,
  encodedUsername,
  encodedPseud,
  filename,
  archive
}: {
  queryDirectoryName: string;
  encodedUsername: string;
  encodedPseud?: string;
  filename: string;
  archive: "ao3" | "superlove";
}) => {
  const username = encodeURIComponent(decodeFilename(encodedUsername));
  const pseud = encodedPseud === undefined
    ? undefined
    : encodeURIComponent(decodeFilename(encodedPseud));
  const userPath = `/users/${username}`;
  const url = new URL(
    pseud === undefined
      ? `${userPath}/works`
      : `${userPath}/pseuds/${pseud}/works`,
    getArchiveUrl(archive),
  );
  const searchParams = getSearchParamsFromQueryPath(
    queryDirectoryName,
    filename,
  );
  url.search = searchParams.toString();
  return url.href;
};


export function getUrlFromPath(
  relativePath: string,
  archive: "ao3" | "superlove"
): string {
  const urlPath = path.dirname(relativePath);
  const filename = path.basename(relativePath);

  const segments = urlPath.split(path.sep).filter(Boolean);

  if (segments[0] === "series" && /^\d+\.html$/.test(filename)) {
    const url = new URL(`/${segments.join("/")}`, getArchiveUrl(archive));
    url.searchParams.set("page", String(parseInt(filename, 10)));
    return url.href;
  }

  if (
    segments[0] === "users" &&
    segments[segments.length - 2] === "works" &&
    // a .html file with just numbers before it (e.g., 01.html, 02.html)
    /^\d+\.html$/.test(filename)
  ) {
    return getUserWorksUrlFromPath({
      encodedUsername: segments[1],
      encodedPseud: segments[2] === "pseuds" ? segments[3] : undefined,
      queryDirectoryName: segments[segments.length - 1],
      filename,
      archive,
    });
  }

  if (segments.includes("tag-search")) {
    return getSearchUrlFromPath({
      queryDirectoryName: segments[segments.length - 1],
      filename,
      archive,
    });
  }

  const encodedPath = segments
    .map((segment) =>
      encodeURIComponent(
        decodeFilename(segment)
          .replaceAll("/", "*s*")
          .replaceAll(".", "*d*")
          .replaceAll("&", "*a*")
      )
    )
    .join("/");

  // Only include the filename if it's not index.html
  if (filename !== "index.html") {
    return new URL(
      `/${encodedPath}/${filename.replace(/\.html$/, "")}/`,
      getArchiveUrl(archive),
    ).href;
  }

  return new URL(`/${encodedPath}/`, getArchiveUrl(archive)).href;
}

export function getFilePathFromUrl(url: string | URL) {
  const archive = getArchiveFromUrl(url);
  const parsedUrl = new URL(url);

  // Split path into segments and remove empty strings
  const segments = parsedUrl.pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];
  const hasExtension = lastSegment?.includes(".");

  if (segments[0] === "series" && parsedUrl.searchParams.has("page")) {
    const pageFileName = getPageFileName(parsedUrl.searchParams);
    return path.join(
      getArchiveDataDir(archive),
      ...segments.map((segment) => safeFilenamify(decodeURIComponent(segment))),
      pageFileName === "01.html" ? "index.html" : pageFileName,
    );
  }

  if (segments[0] === "tags" && lastSegment === "search") {
    return path.join(
      getArchiveDataDir(archive),
      getFilePathForSearchUrl(parsedUrl),
    );
  }

  if (segments[0] === "users" && lastSegment === "works") {
    const queryPath = getUserWorksQueryPath(parsedUrl);
    if (queryPath) {
      return path.join(
        getArchiveDataDir(archive),
        ...segments.map((segment) =>
          safeFilenamify(decodeURIComponent(segment)),
        ),
        queryPath,
      );
    }
  }

  // If the last segment is a file, use segments up to the last one for the directory
  // Otherwise use all segments, unless the last path is "works".
  const dirSegments =
    hasExtension || lastSegment == "works" ? segments.slice(0, -1) : segments;
  const dirPath = path.join(
    getArchiveDataDir(archive),
    ...dirSegments.map((segment) =>
      safeFilenamify(decodeURIComponent(segment)),
    ),
  );

  // If last segment has an extension, use it as filename, otherwise use index.html
  // However, if it is "works" use "works.html"
  return path.join(
    dirPath,
    hasExtension
      ? lastSegment
      : lastSegment == "works"
        ? "works.html"
        : "index.html",
  );
}

export async function recursivelyGetFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await recursivelyGetFiles(fullPath)));
    } else if (
      entry.name === "index.html" ||
      entry.name.endsWith(".html") ||
      entry.name.endsWith(".atom")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}
export function getArchiveUrl(archive: "ao3" | "superlove") {
  const hostname = ARCHIVE_URLS[archive];
  if (!hostname) {
    throw new Error("Invalid archive url");
  }

  return `https://${hostname}`;
}

export function getArchiveFromUrl(input: string | URL): "ao3" | "superlove" {
  const hostname = (input instanceof URL ? input : new URL(input)).hostname;
  const archive = hostname.includes(ARCHIVE_URLS.ao3)
    ? "ao3"
    : hostname.includes(ARCHIVE_URLS.superlove)
      ? "superlove"
      : null;
  if (!archive) {
    throw new Error(`Cannot determine archive from URL: ${input}`);
  }
  return archive;
}

export function getArchiveFromPath(relativePath: string): "ao3" | "superlove" {
  return relativePath.startsWith("ao3") ? "ao3" : "superlove";
}
