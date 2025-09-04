import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";

const getDataDir = (archive: "ao3" | "superlove" = "ao3") =>
  path.resolve(fileURLToPath(import.meta.url), `../../../data/${archive}/tags`);

export default http.all(
  "https://archiveofourown.org/tags/:name",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getDataDir(),
        filenamify(params.name as string),
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
);
