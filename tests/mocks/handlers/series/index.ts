import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";

const getDataDir = (archive: "ao3" | "superlove" = "ao3") =>
  path.resolve(
    fileURLToPath(import.meta.url),
    `../../../data/${archive}/series`
  );

export default http.all(
  "https://archiveofourown.org/series/:series_id",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getDataDir(),
        filenamify(params.series_id as string),
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
);
