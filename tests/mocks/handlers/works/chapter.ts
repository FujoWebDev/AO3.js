import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const WORKS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/works"
);

export default rest.all(
  "https://archiveofourown.org/works/:work_id/chapters/:chapter_id",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        WORKS_DATA_DIR,
        filenamify(req.params.work_id as string),
        `${filenamify(req.params.chapter_id as string || "index")}.html`
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
