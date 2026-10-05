import fs from "fs/promises";
import path from "path";

const KNOWN_404 = [
  "https://archiveofourown.org/tags/56312666/feed.atom/",
  "https://archiveofourown.org/works/41237499/",
]

import {
  decodeFilename,
  delay,
  downloadWithRetry,
  recursivelyGetFiles,
  getRootDataDir,
  getArchiveFromPath,
  getArchiveUrl,
  Http404Error,
} from "./utils.mts";

const SECOND_PASS_WAIT_MS = 2 * 60 * 1000;

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

type DownloadOutcome =
  | { status: "ok" }
  | { status: "404"; record: { path: string; url: string; known: boolean } }
  | { status: "failed"; record: { path: string; url: string } };

async function downloadFile({
  fullPath,
  rootDataDir,
}: {
  fullPath: string;
  rootDataDir: string;
}): Promise<DownloadOutcome> {
  const relativePath = path.relative(rootDataDir, fullPath);
  const archive = getArchiveFromPath(relativePath);
  const url = getUrlFromPath(path.relative(archive, relativePath), archive);
  console.log(`Downloading ${url}`);
  console.log(`Target file: ${fullPath}`);

  try {
    const result = await downloadWithRetry(url);
    await fs.writeFile(fullPath, result);
    console.log(`Successfully updated ${relativePath}`);
    return { status: "ok" };
  } catch (error) {
    if (error instanceof Http404Error) {
      console.log("******");
      console.log(`Received 404 for ${url}. Make sure this is intentional.`);
      await fs.writeFile(fullPath, error.content);
      console.log("******");
      return {
        status: "404",
        record: { path: fullPath, url, known: KNOWN_404.includes(url) },
      };
    }
    console.error(`Failed to update ${relativePath}:`, error);
    return { status: "failed", record: { path: fullPath, url } };
  }
}

async function downloadFiles({
  fullPaths,
  rootDataDir,
}: {
  fullPaths: string[];
  rootDataDir: string;
}) {
  const failed = new Array<{ path: string; url: string }>();
  const pathsWith404 = new Array<{ path: string; url: string; known: boolean }>();

  for (const fullPath of fullPaths) {
    const outcome = await downloadFile({ fullPath, rootDataDir });
    if (outcome.status === "failed") {
      failed.push(outcome.record);
    } else if (outcome.status === "404") {
      pathsWith404.push(outcome.record);
    }
    // Add a small delay between downloads to be nice to the server
    await delay(1000);
  }

  return { failed, pathsWith404 };
}

async function redownloadArticles() {
  const rootDataDir = getRootDataDir();
  const files = await recursivelyGetFiles(rootDataDir);

  const firstPass = await downloadFiles({ fullPaths: files, rootDataDir });
  const pathsWith404 = [...firstPass.pathsWith404];
  let failures = firstPass.failed;

  if (failures.length > 0) {
    console.log(
      `${failures.length} files failed. Waiting ${SECOND_PASS_WAIT_MS / 1000}s before a second pass...`,
    );
    await delay(SECOND_PASS_WAIT_MS);
    const secondPass = await downloadFiles({
      fullPaths: failures.map((failure) => failure.path),
      rootDataDir,
    });
    pathsWith404.push(...secondPass.pathsWith404);
    failures = secondPass.failed;
  }

  console.log("Make sure all 404 are intentional:");
  console.dir(pathsWith404, { depth: null });

  if (failures.length === 0) {
    console.log("All files downloaded with success.");
    return;
  }

  console.error(
    `${failures.length} of ${files.length} files could not be updated:`,
  );
  console.dir(failures, { depth: null });
  process.exit(1);
}

redownloadArticles();
