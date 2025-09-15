import fs from "fs/promises";
import path from "path";

import {
  delay,
  downloadWithRetry,
  DownloadResult,
  recursivelyGetFiles,
  getRootDataDir,
  getArchiveFromPath,
  getArchiveUrl,
} from "./utils.mts";

// Function to decode an encoded filename
// TODO: write a better description
function decodeFilename(encodedName: string): string {
  return encodedName
    .replace(/!d!/g, ".") // Period
    .replace(/!a!/g, "&") // Ampersand
    .replace(/!s!/g, "/") // Forward slash
    .replace(/\*a\*/g, "&"); // Alternative ampersand encoding
}

function getUrlFromPath(
  relativePath: string,
  archive: "ao3" | "superlove"
): string {
  const urlPath = path.dirname(relativePath);
  const filename = path.basename(relativePath);

  const segments = urlPath.split(path.sep).filter(Boolean);

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
    return new URL(`/${encodedPath}/${filename}/`, getArchiveUrl(archive)).href;
  }

  return new URL(`/${encodedPath}/`, getArchiveUrl(archive)).href;
}

async function redownloadArticles() {
  try {
    const rootDataDir = getRootDataDir();
    const files = await recursivelyGetFiles(rootDataDir);

    for (const fullPath of files) {
      const relativePath = path.relative(rootDataDir, fullPath);
      const archive = getArchiveFromPath(relativePath);
      const url = getUrlFromPath(path.relative(archive, relativePath), archive);
      console.log(`Downloading ${url}`);
      console.log(`Target file: ${fullPath}`);

      try {
        let result: DownloadResult;
        let success = false;

        while (!success) {
          try {
            result = await downloadWithRetry(url);

            if (result.retryAfter) {
              const waitTime = result.retryAfter;
              console.log(
                `Rate limited. Waiting ${waitTime / 1000} seconds...`
              );
              await delay(waitTime);
              continue;
            }

            await fs.writeFile(fullPath, result.content);
            console.log(`Successfully updated ${relativePath}`);
            success = true;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            if (errorMessage.includes("404")) {
              console.log(
                `Received 404 for ${url}. Make sure this is intentional.`
              );
              await fs.writeFile(fullPath, "");
              console.log(
                `Updated ${relativePath} with empty content due to 404`
              );
              success = true;
            } else {
              // Non-404 errors will be handled by retry logic
              throw error;
            }
          }

          // Add a small delay between successful downloads to be nice to the server
          await delay(1000);
        }
      } catch (error) {
        console.error(`Failed to update ${relativePath}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to process files:", error);
    process.exit(1);
  }
}

redownloadArticles();
