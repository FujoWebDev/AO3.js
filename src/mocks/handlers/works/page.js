const fs = require("fs");
const path = require("path");
const { rest } = require("msw");

import filenamify from "filenamify";

const worksDataDir = path.resolve(__dirname, "..", "..", "data", "works");

module.exports = rest.all(
  "https://archiveofourown.org/works/:name",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(worksDataDir,filenamify(req.params.name as string),"index.html")
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
