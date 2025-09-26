import fs from "fs/promises";
import path from "path";

import {
  delay,
  downloadWithRetry,
  recursivelyGetFiles,
  getRootDataDir,
  getArchiveFromPath,
  getArchiveUrl,
  Http404Error,
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
  const rootDataDir = getRootDataDir();
  const files = await recursivelyGetFiles(rootDataDir);

  const pathsWith404: { path: string; url: string }[] = [];

  for (const fullPath of files) {
    const relativePath = path.relative(rootDataDir, fullPath);
    const archive = getArchiveFromPath(relativePath);
    const url = getUrlFromPath(path.relative(archive, relativePath), archive);
    console.log(`Downloading ${url}`);
    console.log(`Target file: ${fullPath}`);

    try {
      const result = await downloadWithRetry(url);
      await fs.writeFile(fullPath, result);
      console.log(`Successfully updated ${relativePath}`);
    } catch (error) {
      if (error instanceof Http404Error) {
        console.log("******");
        console.log(`Received 404 for ${url}. Make sure this is intentional.`);
        await fs.writeFile(fullPath, error.content);
        console.log("******");
        pathsWith404.push({
          path: fullPath,
          url,
        });
        continue;
      }
      console.error(`Failed to update ${relativePath}:`, error);
      process.exit(1);
    } // Add a small delay between successful downloads to be nice to the server
    await delay(1000);
  }

  console.log("All files downloaded with success.");
  console.log("Make sure all 404 are intentional:");
  console.dir(pathsWith404, { depth: null });
}

redownloadArticles();
