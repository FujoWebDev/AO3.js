import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";

const getDataDir = (archive: "ao3" | "superlove" = "ao3") =>
  path.resolve(
    fileURLToPath(import.meta.url),
    `../../../data/${archive}/works`
  );

export default [
  http.all("https://archiveofourown.org/works/:work_id", ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getDataDir(),
        filenamify(params.work_id as string),
        "index.html"
      )
    );
    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }),
  http.all("https://superlove.sayitditto.net/works/:work_id", ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getDataDir("superlove"),
        filenamify(params.work_id as string),
        "index.html"
      )
    );
    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }),
];
