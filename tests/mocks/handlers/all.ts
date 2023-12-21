import { http, HttpResponse } from "msw";

export default http.all("https://archiveofourown.org/*", ({ request }) => {
  console.error(
    `Unknown AO3 route: ${request.url}. Add a route handler to mock the data.`
  );

  return new HttpResponse(null, {
    status: 500,
  });
});
