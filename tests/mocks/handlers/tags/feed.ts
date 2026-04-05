import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import { getArchiveDataDir, safeFilenamify } from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/tags/:name/feed.atom",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getArchiveDataDir(),
        "tags",
        safeFilenamify(params.name as string),
        "feed.atom"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
