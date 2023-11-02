import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const SERIES_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/series"
);

export default rest.all(
  "https://archiveofourown.org/series/:series_id",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        SERIES_DATA_DIR,
        filenamify(req.params.series_id as string),
        "index.html"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
