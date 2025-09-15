import fs from "fs/promises";
import { dirname } from "path";

import {
  delay,
  downloadWithRetry,
  DownloadResult,
  getFilePathFromUrl,
} from "./utils.mts";

async function downloadUrl(url: string) {
  try {
    const filePath = getFilePathFromUrl(url);
    await fs.mkdir(dirname(filePath), { recursive: true });

    console.log(`Downloading ${url}`);
    console.log(`Target file: ${filePath}`);

    let result: DownloadResult;
    let success = false;

    while (!success) {
      result = await downloadWithRetry(url);

      // downloadWithRetry guards against network failures, but doesn't automatically
      // retry in case of rate limiting. We do that on our own.
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
