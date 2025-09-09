import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";

const WORKS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/works"
);

export default http.all(
  "https://archiveofourown.org/works/:work_id/navigate",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        WORKS_DATA_DIR,
        filenamify(params.work_id as string),
        "navigate.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
