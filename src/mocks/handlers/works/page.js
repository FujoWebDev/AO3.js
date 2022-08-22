const fs = require("fs");
const path = require("path");
const { rest } = require("msw");

const worksDataDir = path.resolve(__dirname, "..", "..", "data", "works");

module.exports = rest.all(
  "https://archiveofourown.org/works/:name",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(worksDataDir, req.params.name, "index.html")
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
