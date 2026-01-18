import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import { getArchiveDataDir } from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/series/:series_id",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getArchiveDataDir(),
        "series",
        filenamify(params.series_id as string),
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
