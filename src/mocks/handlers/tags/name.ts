import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const tagsDataDir = path.resolve(__dirname, "..", "..", "data", "tags");

export default rest.all(
  "https://archiveofourown.org/tags/:name",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        tagsDataDir,
        filenamify(req.params.name as string),
        "index.html"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
