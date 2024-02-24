import { fileURLToPath } from "url";
import filenamify from "filenamify";
import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";

const COLLECTIONS_DATA_DIR = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../data/collections"
);

// note that mock test path becomes works/work_id/chapter_id.html
// unlike in url, there is no /chapters/ directory
export default http.all(
  "https://archiveofourown.org/collections/:collection_name/prompts/:prompt_id",
  ({ params }) => {
    const html = fs.readFileSync(
      path.resolve(
        COLLECTIONS_DATA_DIR,
        filenamify(params.collection_name as string),
        filenamify("prompts"),
        `${filenamify((params.prompt_id as string) || "index")}.html`
      )
    );

    console.log("in prompt.ts")
    return new HttpResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
);
