import fs from "fs/promises";
import path from "path";

const KNOWN_404 = [
  "https://archiveofourown.org/tags/56312666/feed.atom",
  "https://archiveofourown.org/works/41237499/",
]

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

  if (segments.includes("tag-search")) {
    // We assume the last segment is the one with the search tags, may
    // the odds be ever in our favor
    const searchParamsList = segments[segments.length - 1].split("__");
    const polishedSearchParamsList = [];

    for (const param of searchParamsList) {
      if (param.includes('[type]')) {
        // Type should have the first lettter capitalized so we split the search param by "="
        // and capitalize the following word
        const [searchParam, value] = param.split("=");
        const typeCapitalized = value.charAt(0).toUpperCase() + value.slice(1);
        polishedSearchParamsList.push(`${searchParam}=${typeCapitalized}`);
        continue;
      }
      // For general tags we need to replace spaces with +
      polishedSearchParamsList.push(param.replaceAll(" ", "+"));
    }
    // We add one last param, which is the number of the page, which is
    // the name of the file 
    polishedSearchParamsList.push(`page=${filename}`.replace(".html", ""))
    
    const tagsSearchUrl = new URL(`/tags/search`, getArchiveUrl(archive));
    tagsSearchUrl.search = polishedSearchParamsList.join("&")
    
    return tagsSearchUrl.toString();

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
    return new URL(`/${encodedPath}/${filename}/`, getArchiveUrl(archive)).href;
  }

  return new URL(`/${encodedPath}/`, getArchiveUrl(archive)).href;
}

async function redownloadArticles() {
  const rootDataDir = getRootDataDir();
  const files = await recursivelyGetFiles(rootDataDir);

  const pathsWith404: { path: string; url: string; known: boolean }[] = [];

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
          known: KNOWN_404.includes(url),
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
