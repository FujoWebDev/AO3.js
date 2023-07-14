import { rest } from "msw";

export default rest.all("https://archiveofourown.org/*", (req, res, ctx) => {
  console.error(
    `Unknown AO3 route: ${req.url.href}. Add a route handler to mock the data.`
  );

  return res(ctx.status(500));
});
