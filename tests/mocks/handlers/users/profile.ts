import fs from "fs";
import path from "path";
import { http, HttpHandler, HttpResponse } from "msw";
import { getArchiveDataDir, safeFilenamify } from "../../scripts/utils.mjs";

export default http.all(
  "https://archiveofourown.org/users/:name/profile",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        getArchiveDataDir(),
        "users",
        safeFilenamify(params.name as string),
        "profile",
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
) satisfies HttpHandler;
