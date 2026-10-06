import fs from "fs";
import { http, HttpHandler, HttpResponse } from "msw";
import { getFilePathFromUrl } from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/series/:series_id",
  ({ request }) => {
    const html = fs.readFileSync(getFilePathFromUrl(request.url));

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
