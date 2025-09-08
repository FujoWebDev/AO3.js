import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";

const SERIES_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/series"
);

export default http.all(
  "https://archiveofourown.org/series/:series_id",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        SERIES_DATA_DIR,
        filenamify(params.series_id as string),
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
