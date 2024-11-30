import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // 1 second

interface DownloadResult {
  content: string;
  retryAfter?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadWithRetry(url: string, attempt = 1): Promise<DownloadResult> {
  try {
    const response = await fetch(url);
    
    // Check for rate limiting response
    if (response.status === 429) {
      // Get retry-after header (in seconds)
      const retryAfter = parseInt(response.headers.get('retry-after') || '0', 10);
      return {
        content: '',
        retryAfter: retryAfter > 0 ? retryAfter * 1000 : undefined
      };
    }

    // Accept both successful responses and 404s
    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }

    return {
      content: await response.text()
    };
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }

    const backoffDelay = Math.min(
      BASE_DELAY * Math.pow(2, attempt - 1) + Math.random() * 1000,
      30000 // Max 30 seconds
    );
    
    console.log(`Attempt ${attempt} failed, retrying after ${backoffDelay}ms...`);
    await delay(backoffDelay);
    return downloadWithRetry(url, attempt + 1);
  }
}

async function getAllFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else if (entry.name === 'index.html' || entry.name.endsWith('.html') || entry.name.endsWith('.atom')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to decode an encoded filename
function decodeFilename(encodedName: string): string {
    return encodedName
      .replace(/!d!/g, '.') // Period
      .replace(/!a!/g, '&') // Ampersand
      .replace(/!s!/g, '/') // Forward slash
      .replace(/\*a\*/g, '&'); // Alternative ampersand encoding
  }

function getUrlFromPath(relativePath: string): string {
  const urlPath = path.dirname(relativePath);
  
  const segments = urlPath.split(path.sep).filter(Boolean);
  
  const encodedPath = segments
    .map(segment => encodeURIComponent(decodeFilename(segment)))
    .join('/');
  
  return `https://archiveofourown.org/${encodedPath}`;
}
  

async function redownloadArticles() {
  try {
    const files = await getAllFiles(DATA_DIR);
    
    for (const fullPath of files) {
      const relativePath = path.relative(DATA_DIR, fullPath);
      const url = getUrlFromPath(relativePath);
      
      console.log(`Downloading ${url}`);
      console.log(`Target file: ${fullPath}`);
      
      try {
        let result: DownloadResult;
        let success = false;

        while (!success) {
          result = await downloadWithRetry(url);
          
          if (result.retryAfter) {
            const waitTime = result.retryAfter;
            console.log(`Rate limited. Waiting ${waitTime/1000} seconds...`);
            await delay(waitTime);
            continue;
          }

          await fs.writeFile(fullPath, result.content);
          console.log(`Successfully updated ${relativePath}`);
          success = true;

          // Add a small delay between successful downloads to be nice to the server
          await delay(BASE_DELAY);
        }
      } catch (error) {
        console.error(`Failed to update ${relativePath}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to process files:', error);
    process.exit(1);
  }
}

redownloadArticles(); 