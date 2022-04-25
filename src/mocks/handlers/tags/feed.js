const fs = require("fs");
const path = require("path");
const { rest } = require("msw");

const tagsDataDir = path.resolve(__dirname, "..", "..", "data", "tags");

module.exports = rest.all(
  "https://archiveofourown.org/tags/:name/feed.atom",
  (req, res, ctx) => {
    const feed = fs.readFileSync(
      path.resolve(tagsDataDir, req.params.name, "feed.atom")
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(feed));
  }
);
