import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const TAGS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/tags"
);

export default rest.all(
  "https://archiveofourown.org/tags/:name/works",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        TAGS_DATA_DIR,
        filenamify(req.params.name as string),
        "works.html"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
