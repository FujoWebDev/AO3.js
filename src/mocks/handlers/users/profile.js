const fs = require("fs");
const path = require("path");
const { rest } = require("msw");

const usersDataDir = path.resolve(__dirname, "..", "..", "data", "users");

module.exports = rest.all(
  "https://archiveofourown.org/users/:name/profile",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(usersDataDir, req.params.name, "profile", "index.html")
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
