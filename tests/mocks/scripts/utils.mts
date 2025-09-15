import filenamify from "filenamify";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // 1 second

export interface DownloadResult {
  content: string;
  retryAfter?: number;
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ARCHIVE_URLS = {
  ao3: "archiveofourown.org",
  superlove: "superlove.sayitditto.net",
};

export async function downloadWithRetry(
  url: string,
  attempt = 1
): Promise<DownloadResult> {
  try {
    const response = await fetch(url);

    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("retry-after") || "0",
        10
      );
      return {
        content: "",
        retryAfter: retryAfter > 0 ? retryAfter * 1000 : undefined,
      };
    }

    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }

    return {
      content: await response.text(),
    };
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }

    const backoffDelay = Math.min(
      BASE_DELAY * Math.pow(2, attempt - 1) + Math.random() * 1000,
      30000 // Max 30 seconds
    );

    console.log(
      `Attempt ${attempt} failed, retrying after ${backoffDelay}ms...`
    );
    await delay(backoffDelay);
    return downloadWithRetry(url, attempt + 1);
  }
}

export function getRootDataDir() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "..", "data");
}

export function getArchiveDataDir(archive: "ao3" | "superlove" = "ao3") {
  return path.join(getRootDataDir(), archive);
}

export function getFilePathFromUrl(url: string | URL) {
  const archive = getArchiveFromUrl(url);
  const parsedUrl = new URL(url);

  // Split path into segments and remove empty strings
  const segments = parsedUrl.pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];
  const hasExtension = lastSegment?.includes(".");

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
