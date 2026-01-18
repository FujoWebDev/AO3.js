import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import {
  getArchiveDataDir,
  getFilePathForSearchUrl,
} from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/tags/search",
  ({ request }) => {
    const url = new URL(request.url);
    const relativePath = getFilePathForSearchUrl(url);
    const html = fs.readFileSync(
      path.resolve(getArchiveDataDir(), relativePath)
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
