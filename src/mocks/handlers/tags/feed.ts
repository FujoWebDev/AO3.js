import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { rest } from "msw";

const tagsDataDir = path.resolve(__dirname, "..", "..", "data", "tags");

export default rest.all(
  "https://archiveofourown.org/tags/:name/feed.atom",
  (req, res, ctx) => {
    const feed = fs.readFileSync(
      path.resolve(
        tagsDataDir,
        filenamify(req.params.name as string),
        "feed.atom"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(feed));
  }
);
