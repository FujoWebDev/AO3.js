import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";

const USERS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/users"
);

export default http.all(
  "https://archiveofourown.org/users/:name/profile",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        USERS_DATA_DIR,
        filenamify(params.name as string),
        "profile",
        "index.html"
      )
    );

    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
);
