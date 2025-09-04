import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import filenamify from "filenamify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getDataDir = (archive: "ao3" | "superlove" = "ao3") =>
  path.join(__dirname, "..", "data", archive);
const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // 1 second

interface DownloadResult {
  content: string;
  retryAfter?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadWithRetry(
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

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment)
    .replaceAll(".", "!d!")
    .replaceAll("/", "!s!")
    .replaceAll("&", "!a!");
}

const ARCHIVE_URLS = {
  ao3: "archiveofourown.org",
  superlove: "superlove.sayitditto.net",
};

async function downloadUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (
      !Object.values(ARCHIVE_URLS).some((archive) =>
        parsedUrl.hostname.includes(archive)
      )
    ) {
      throw new Error(
        `URL must be from ${Object.values(ARCHIVE_URLS).join(" or ")}`
      );
    }

    // Split path into segments and remove empty strings
    const segments = parsedUrl.pathname.split("/").filter(Boolean);

    const lastSegment = segments[segments.length - 1];
    const hasExtension = lastSegment?.includes(".");

    // If the last segment is a file, use segments up to the last one for the directory
    // Otherwise use all segments, unless the last path is "works".
    const dirSegments =
      hasExtension || lastSegment == "works" ? segments.slice(0, -1) : segments;
    const dirPath = path.join(
      getDataDir(
        parsedUrl.hostname.includes(ARCHIVE_URLS.superlove)
          ? "superlove"
          : "ao3"
      ),
      ...dirSegments.map((segment) => filenamify(decodeURIComponent(segment)))
    );
    await fs.mkdir(dirPath, { recursive: true });

    // If last segment has an extension, use it as filename, otherwise use index.html
    // However, if it is "works" use "works.html"
    const filePath = path.join(
      dirPath,
      hasExtension
        ? lastSegment
        : lastSegment == "works"
        ? "works.html"
        : "index.html"
    );

    console.log(`Downloading ${url}`);
    console.log(`Target file: ${filePath}`);

    let result: DownloadResult;
    let success = false;

    while (!success) {
      result = await downloadWithRetry(url);

      if (result.retryAfter) {
        const waitTime = result.retryAfter;
        console.log(`Rate limited. Waiting ${waitTime / 1000} seconds...`);
        await delay(waitTime);
        continue;
      }

      await fs.writeFile(filePath, result.content);
      console.log(`Successfully downloaded to ${filePath}`);
      success = true;
    }
  } catch (error) {
    console.error("Failed to download:", error);
    process.exit(1);
  }
}

// Get URL from command line argument
const url = process.argv[2];
if (!url) {
  console.error("Please provide an AO3 or superlove URL as an argument");
  process.exit(1);
}

downloadUrl(url);
