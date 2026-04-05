import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import { getArchiveDataDir, safeFilenamify } from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/works/:work_id/navigate",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getArchiveDataDir(),
        "works",
        safeFilenamify(params.work_id as string),
        "navigate.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
