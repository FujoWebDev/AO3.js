import fs from "fs";
import path from "path";
import { rest } from "msw";

const usersDataDir = path.resolve(__dirname, "..", "..", "data", "users");

export default rest.all(
  "https://archiveofourown.org/users/:name/profile",
  (req, res, ctx) => {
    const html = fs.readFileSync(
      path.resolve(
        usersDataDir,
        req.params.name as string,
        "profile",
        "index.html"
      )
    );

    return res(ctx.set("Content-Type", "text/html"), ctx.body(html));
  }
);
