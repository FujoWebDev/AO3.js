import filenamify from "filenamify";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const BASE_DELAY = 1000; // 1 second

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

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function downloadWithRetry(
  url: string,
  maxAttempts = 3,
  currentAttempt = 1
) {
  try {
    const response = await fetch(url, {
      headers: {
        Cookie: "view_adult=true;",
      },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("retry-after") || "0",
        10
      );

      console.log(`Rate limited. Waiting ${retryAfter / 1000} seconds...`);
      await delay(retryAfter);

      // Skip the rest and try to redownload from scratch
      // We don't increase currentAttempt when we're just being rate limited
      return downloadWithRetry(url, maxAttempts, currentAttempt);
    }

    if (!response.ok) {
      if (response.status !== 404) {
        throw new Error(`Failed to download ${url}: ${response.status}`);
      }
      // We let 404 errors be handled by the consumers as they wish
      const newError = new Http404Error("404 error returned");
      newError.content = await response.text();
      throw newError;
    }

    return await response.text();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (currentAttempt >= maxAttempts) {
      throw error;
    }

    const backoffDelay = Math.min(
      BASE_DELAY * Math.pow(2, currentAttempt - 1) + Math.random() * 1000,
      30000 // Max 30 seconds
    );

    console.log(
      `Attempt ${currentAttempt} failed, retrying after ${backoffDelay}ms...`
    );
    console.log(`Error message was ${errorMessage}`);
    await delay(backoffDelay);
    return downloadWithRetry(url, maxAttempts, currentAttempt + 1);
  }
}

export function getRootDataDir() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", "data");
}

export function getArchiveDataDir(archive: "ao3" | "superlove" = "ao3") {
  return path.join(getRootDataDir(), archive);
}

// These parameters are excluded from the tag search folder name.
// Page is used for the page number instead (i.e. 01.html, 02.html, etc.),
// while view_adult is excluded because we simply add it to the all pages
// to make sure we bypass the adult banner.
const TAG_SEARCH_EXCLUDED_PARAMS = new Set(["page", "view_adult"]);

const getNormalizedTagSearchFolder = (searchParams: URLSearchParams) => {
  const entries: string[] = [];
  // Sort the parameters to make the folder name deterministic
  const keys = Array.from(new Set([...searchParams.keys()])).sort();

  for (const key of keys) {
    if (TAG_SEARCH_EXCLUDED_PARAMS.has(key)) {
      continue;
    }
    const values = searchParams.getAll(key);
    // Also sort the values of the same keys
    const sortedValues = values.length > 1 ? [...values].sort() : values;
    for (const value of sortedValues) {
      const segment = `${key}=${value}`;
      entries.push(filenamify(segment, { replacement: "_", maxLength: 100 }));
    }
  }

  if (entries.length === 0) {
    return "default";
  }

  return entries.join("__");
};

export const getFilePathForSearchUrl = (parsedUrl: URL) => {
  const folderName = getNormalizedTagSearchFolder(parsedUrl.searchParams);
  const rawPage = parsedUrl.searchParams.get("page");
  const page = Number.parseInt(rawPage ?? "1", 10);
  const fileName = `${String(page).padStart(2, "0")}.html`;

  // TODO: make this support other search types with time
  return path.join("tag-search", folderName, fileName);
};

export function getFilePathFromUrl(url: string | URL) {
  const archive = getArchiveFromUrl(url);
  const parsedUrl = new URL(url);

  // Split path into segments and remove empty strings
  const segments = parsedUrl.pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];
  const hasExtension = lastSegment?.includes(".");

  if (segments[0] === "tags" && lastSegment === "search") {
    return path.join(
      getArchiveDataDir(archive),
      getFilePathForSearchUrl(parsedUrl)
    );
  }

  // If the last segment is a file, use segments up to the last one for the directory
  // Otherwise use all segments, unless the last path is "works".
  const dirSegments =
    hasExtension || lastSegment == "works" ? segments.slice(0, -1) : segments;
  const dirPath = path.join(
    getArchiveDataDir(archive),
    ...dirSegments.map((segment) => filenamify(decodeURIComponent(segment)))
  );

  // If last segment has an extension, use it as filename, otherwise use index.html
  // However, if it is "works" use "works.html"
  return path.join(
    dirPath,
    hasExtension
      ? lastSegment
      : lastSegment == "works"
      ? "works.html"
      : "index.html"
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
