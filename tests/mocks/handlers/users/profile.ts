import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const USERS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/users"
);

export default rest.all(
  "https://archiveofourown.org/users/:name/profile",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        USERS_DATA_DIR,
        filenamify(req.params.name as string),
        "profile",
        "index.html"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
