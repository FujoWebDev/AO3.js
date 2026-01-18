import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import { getArchiveDataDir } from "../../scripts/utils.mjs";

export default [
  http.all("https://archiveofourown.org/works/:work_id", ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getArchiveDataDir(),
        "works",
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
        getArchiveDataDir("superlove"),
        "works",
        filenamify(params.work_id as string),
        "index.html"
      )
    );
    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }),
] satisfies HttpHandler[];
