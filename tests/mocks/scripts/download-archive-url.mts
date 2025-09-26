import fs from "fs/promises";
import { dirname } from "path";

import { downloadWithRetry, getFilePathFromUrl } from "./utils.mts";

async function downloadUrl(url: string) {
  try {
    const filePath = getFilePathFromUrl(url);
    await fs.mkdir(dirname(filePath), { recursive: true });

    console.log(`Downloading ${url}`);
    console.log(`Target file: ${filePath}`);

    const result = await downloadWithRetry(url);
    await fs.writeFile(filePath, result);

    console.log(`Successfully downloaded to ${filePath}`);
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
