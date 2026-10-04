import fs from "fs";
import { http, HttpHandler, HttpResponse } from "msw";
import { getFilePathFromUrl } from "../../scripts/utils.mjs";

const respondWithWorksFile = ({ request }: { request: Request }) => {
  const html = fs.readFileSync(getFilePathFromUrl(request.url));

  return new HttpResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
};

export default [
  http.all("https://archiveofourown.org/users/:name/works", respondWithWorksFile),
  http.all(
    "https://archiveofourown.org/users/:name/pseuds/:pseud/works",
    respondWithWorksFile
  ),
] satisfies HttpHandler[];
