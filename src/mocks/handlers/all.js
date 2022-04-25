const { rest } = require("msw");

module.exports = rest.all("https://archiveofourown.org/*", (req, res, ctx) => {
  console.error(`Unknown route: ${req.url.href}`);
  console.error("Add a route handler to mock the data.");

  return res(ctx.status(500));
});
