const fs = require("fs");
const path = require("path");
const { rest } = require("msw");

const tagsDataDir = path.resolve(__dirname, "..", "..", "data", "tags");

module.exports = rest.all(
  "https://archiveofourown.org/tags/:name",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(tagsDataDir, req.params.name, "index.html")
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
