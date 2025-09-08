import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";

const TAGS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/tags"
);

export default http.all(
  "https://archiveofourown.org/tags/:name/works",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        TAGS_DATA_DIR,
        filenamify(params.name as string),
        "works.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
