import { getWork } from "src/index";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { resetArchiveBaseUrl, setArchiveBaseUrl } from "src/urls";

describe("Works/data", () => {
  beforeAll(() => {
    setArchiveBaseUrl("https://superlove.sayitditto.net/");
  });
  afterAll(() => {
    resetArchiveBaseUrl();
  });

  it("should fetch work information in its entirety", async () => {
    const work = await getWork({
      workId: "1269",
    });

    if (work.locked) {
      throw new Error("Work is not expected to be locked");
    }

    // Stats change very often, so we remove them from this test
    const { stats, ...workWithoutStats } = work;

    expect(workWithoutStats).toMatchInlineSnapshot(`
      {
        "adult": false,
        "authors": [
          {
            "anonymous": false,
            "pseud": "melo",
            "username": "melo",
          },
        ],
        "category": [
          "F/F",
        ],
        "chapterInfo": null,
        "chapters": {
          "published": 1,
          "total": 1,
        },
        "complete": true,
        "fandoms": [
          "Batgirl",
          "Teen Titans",
        ],
        "id": 1269,
        "language": "English",
        "locked": false,
        "publishedAt": "2025-08-23",
        "rating": "Teen And Up Audiences",
        "series": [],
        "summary": "<p>Life after the wolves.</p>",
        "tags": {
          "additional": [
            "Moving On",
            "Past Trauma",
            "Grief/Mourning",
            "Cassandra Cain's Evil Arc (DCU)",
            "Power Rangers Megaforce: S20E13 - Dream Snatcher",
          ],
          "characters": [
            "Cassandra Cain",
            "Rose Wilson",
          ],
          "relationships": [
            "Cassandra Cain/Rose Wilson",
          ],
          "warnings": [
            "Creator Chose Not To Use Archive Warnings",
          ],
        },
        "title": "and she burned the sky",
        "updatedAt": null,
        "words": 500,
      }
    `);
  });
});
