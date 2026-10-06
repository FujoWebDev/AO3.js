import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const KNOWN_404 = [
  "https://archiveofourown.org/tags/56312666/feed.atom/",
  "https://archiveofourown.org/works/41237499/",
]

import {
  delay,
  downloadWithRetry,
  recursivelyGetFiles,
  getRootDataDir,
  getArchiveFromPath,
  getUrlFromPath,
  Http404Error,
} from "./utils.mjs";

const SECOND_PASS_WAIT_MS = 2 * 60 * 1000;

type DownloadStatus =
  | { status: "ok" }
  | { status: "404"; record: { path: string; url: string; known: boolean } }
  | { status: "failed"; record: { path: string; url: string } };

async function downloadFile({
  fullPath,
  rootDataDir,
}: {
  fullPath: string;
  rootDataDir: string;
}): Promise<DownloadStatus> {
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
      const known = KNOWN_404.includes(url);
      await fs.writeFile(fullPath, error.content);
      if (!known) {
        console.error(`Unexpected 404; updated ${relativePath} with the 404 response`);
      }
      console.log("******");
      return {
        status: "404",
        record: { path: fullPath, url, known },
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

export async function redownloadArticles() {
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

  const unexpected404s = pathsWith404.filter((record) => !record.known);
  if (failures.length === 0 && unexpected404s.length === 0) {
    console.log("All files downloaded with success.");
    return true;
  }

  console.error(
    `${failures.length + unexpected404s.length} of ${files.length} files failed to download or returned an unexpected 404:`,
  );
  console.dir([...failures, ...unexpected404s], { depth: null });
  return false;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (!await redownloadArticles()) {
    // Let it finish even though some files failed to download
    process.exitCode = 1;
  }
}
