import { getUserWorks } from "src/index";
import { ArchivePageRequestError } from "src/utils";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import server from "./mocks/server";

describe("User/works", () => {
  it("should fetch the first page of a user's works", async () => {
    const result = await getUserWorks({ username: "astolat" });

    expect(result.works).toHaveLength(20);
    expect(result.pages).toEqual({
      current: 1,
      total: expect.driftingCount({ atLeast: 27, atMost: 40 }),
    });
    expect(result.totalResults).driftingCount({ atLeast: 535, atMost: 800 });

    // We just look at the titles to make the snapshot more readable
    expect(result.works.map((work) => work.title)).toMatchInlineSnapshot(`
      [
        "Research",
        "Inheritance",
        "Looking At Stone",
        "Hallelujah",
        "Tourney Field",
        "Oubliette",
        "Entrapment",
        "Press Gang",
        "Common Knowledge",
        "The Pack Survives",
        "The Price of Bread and Salt",
        "A Man of Honor",
        "Let The River Run",
        "Winter's Crown",
        "Royal Flush",
        "Lifeline",
        "Heal Thyself",
        "Raised By Wolves",
        "Paying Debts",
        "The Next Time",
      ]
    `);
  });

  it("should fetch the details of a work in the list", async () => {
    const result = await getUserWorks({ username: "astolat" });

    // Pick an older, finished work by id so new uploads don't shift the snapshot
    const work = result.works.find((work) => work.id === 43703871);

    expect(work).toMatchInlineSnapshot(`
      {
        "adult": false,
        "authors": [
          {
            "anonymous": false,
            "pseud": "astolat",
            "username": "astolat",
          },
        ],
        "chapters": {
          "published": 9,
          "total": 9,
        },
        "complete": true,
        "fandoms": [
          "Game of Thrones (TV)",
        ],
        "id": 43703871,
        "language": "English",
        "shortUrl": "https://ao3.org/works/43703871",
        "stats": {
          "bookmarks": 1255,
          "hits": 111695,
          "kudos": 5685,
        },
        "summary": "<p>The deep satisfaction of having made the right choice; of having found a clear-flowing wellspring of true honor to protect.</p>",
        "tags": {
          "additional": [
            "Red Wedding",
            "Riverlands",
            "Grief",
            "Recovery",
            "Suicidal Thoughts",
          ],
          "characters": [
            "Brienne of Tarth",
            "Robb Stark",
            "Jaime Lannister",
            "Tyrion Lannister",
            "Sansa Stark",
            "Arya Stark",
            "Catelyn Tully Stark",
            "Daenerys Targaryen",
          ],
          "relationships": [
            "Jaime Lannister/Robb Stark/Brienne of Tarth",
            "Jaime Lannister/Brienne of Tarth",
            "Jaime Lannister/Robb Stark",
            "Tyrion Lannister & Sansa Stark",
            "pre-Tyrion Lannister/Sansa Stark",
            "Robb Stark & Brienne of Tarth",
            "Jaime Lannister & Tyrion Lannister",
            "Arya Stark & Robb Stark",
            "Robb Stark/Daenerys Targaryen",
          ],
        },
        "title": "Let The River Run",
        "updatedAt": "2022-12-25",
        "url": "https://archiveofourown.org/works/43703871",
        "words": 61498,
      }
    `);
  });

  it("should return the filters that were requested", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      sortColumn: "title",
      sortDirection: "desc",
    });

    expect(result.filters).toEqual({
      sortColumn: "title",
      sortDirection: "desc",
      page: 1,
    });
    // AO3 sorts on a normalized title: lowercased, leading "a"/"an"/"the" moved
    // to the end, so "The Mega-Blast..." sorts under "m". See
    // https://github.com/otwcode/otwarchive/blob/9dd99008f52ccc726978db131181421f4eb38fe5/app/models/work.rb#L1106-L1112
    expect(result.works.map((work) => work.title)).toMatchInlineSnapshot(`
      [
        "Who Can I Turn To?",
        "What do you want?",
        "Visceral",
        "Trust",
        "Toy Soldier",
        "Thirty Clove",
        "Something to focus on...",
        "Self-Reflection",
        "Reckless Recreational Spell Use",
        "One for One",
        "olin lipu",
        "Nothing is Whole and Nothing is Broken",
        "Nightmare Horse",
        "Mountains",
        "The Mega-Blast Dick Breaker",
        "Love Me or Leave Me",
        "Keeping Warm",
        "Jaunt",
        "Inflict Wounds",
        "Impossible Claims",
      ]
    `);
  });

  it("should fetch an empty list for a user with no works", async () => {
    const result = await getUserWorks({ username: "franzeska" });

    expect(result).toEqual({
      filters: { sortColumn: "updated_at", sortDirection: "desc", page: 1 },
      works: [],
      pages: { total: 0, current: 1 },
      totalResults: 0,
    });
  });

  it("should throw ArchivePageRequestError for a user that doesn't exist", async () => {
    server.use(
      http.get(
        "https://archiveofourown.org/users/missinguser/works",
        () => new HttpResponse(null, { status: 404 }),
      ),
    );
    const failedWorks = getUserWorks({ username: "missinguser" });

    await expect(failedWorks).rejects.toThrow(ArchivePageRequestError);
    await expect(failedWorks).rejects.toThrow(
      "Archive request failed with status 404: https://archiveofourown.org/users/missinguser/works?page=1&work_search%5Bsort_column%5D=revised_at",
    );
  });

  it("should fetch a user's works sorted by most recently updated", async () => {
    const result = await getUserWorks({ username: "chemicalcain" });

    expect(result.filters).toEqual({
      sortColumn: "updated_at",
      sortDirection: "desc",
      page: 1,
    });
    expect(result.works).toHaveLength(20);
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "Mountains",
          "Nightmare Horse",
          "Toy Soldier",
          "One for One",
          "Blasphemy",
        ]
      `);
  });

  it("should fetch a user's works sorted by hits", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      sortColumn: "hits",
    });

    expect(result.filters).toEqual({
      sortColumn: "hits",
      sortDirection: "desc",
      page: 1,
    });
    expect(result.works).toHaveLength(20);
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "As Sweet As A Song, As Right As A Wrong",
          "Cravats For Kravitz",
          "Self-Reflection",
          "Thirty Clove",
          "Hey Jealousy",
        ]
      `);
  });

  it("should fetch only the works posted under a pseud", async () => {
    const result = await getUserWorks({
      username: "astolat",
      pseud: "shalott",
    });

    expect(result.works.length).toBeGreaterThan(0);
    for (const work of result.works) {
      expect(work.authors).toContainEqual({
        username: "astolat",
        pseud: "shalott",
        anonymous: false,
      });
    }
    expect(result.totalResults).toMatchInlineSnapshot(`1`);
  });

  it("should fetch the works of a pseud with spaces in its name", async () => {
    const result = await getUserWorks({
      username: "astolat",
      pseud: "the lady of shalott",
    });

    expect(result.works).toHaveLength(18);
    expect(result.pages).toEqual({ total: 1, current: 1 });
    expect(result.totalResults).toBe(18);
    for (const work of result.works) {
      expect(work.authors).toEqual([
        { username: "astolat", pseud: "the lady of shalott", anonymous: false },
      ]);
    }
  });

  it("should fetch the first page of a pseud's works across many pages", async () => {
    const result = await getUserWorks({ username: "astolat", pseud: "astolat" });

    expect(result.works).toHaveLength(20);
    expect(result.pages).toEqual({
      current: 1,
      total: expect.driftingCount({ atLeast: 26, atMost: 40 }),
    });
    expect(result.totalResults).driftingCount({ atLeast: 516, atMost: 800 });
    for (const work of result.works) {
      expect(work.authors).toContainEqual({
        username: "astolat",
        pseud: "astolat",
        anonymous: false,
      });
    }
  });

  it("should fetch a pseud's works sorted by hits", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      pseud: "chemicalcain",
      sortColumn: "hits",
    });

    expect(result.filters).toEqual({
      sortColumn: "hits",
      sortDirection: "desc",
      page: 1,
    });
    expect(result.works).toHaveLength(20);
    expect(result.pages).toEqual({ total: 2, current: 1 });
    expect(result.totalResults).toBe(34);
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "As Sweet As A Song, As Right As A Wrong",
          "Cravats For Kravitz",
          "Self-Reflection",
          "Thirty Clove",
          "Hey Jealousy",
        ]
      `);
  });

  it("should list the same works for a user's only pseud", async () => {
    const userWorks = await getUserWorks({ username: "chemicalcain" });
    const pseudWorks = await getUserWorks({
      username: "chemicalcain",
      pseud: "chemicalcain",
    });

    expect(pseudWorks.works).toEqual(userWorks.works);
    expect(pseudWorks.totalResults).toBe(userWorks.totalResults);
  });

  it("should fetch a user's works sorted by title", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      sortColumn: "title",
    });

    // AO3 sorts titles A to Z when no direction is given.
    expect(result.filters).toEqual({
      sortColumn: "title",
      sortDirection: "asc",
      page: 1,
    });
    expect(result.works).toHaveLength(20);
    // AO3 sorts on a normalized title: lowercased, leading "a"/"an"/"the" moved
    // to the end, so "The Mega-Blast..." sorts under "m". See
    // https://github.com/otwcode/otwarchive/blob/9dd99008f52ccc726978db131181421f4eb38fe5/app/models/work.rb#L1106-L1112
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "Armadillidiidae",
          "As Sweet As A Song, As Right As A Wrong",
          "Beauty",
          "Blasphemy",
          "Bold",
        ]
      `);
  });

  it("should fetch a user's works sorted by date posted", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      sortColumn: "created_at",
    });

    expect(result.filters.sortColumn).toBe("created_at");
    expect(result.works).toHaveLength(20);
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "Mountains",
          "Nightmare Horse",
          "Toy Soldier",
          "One for One",
          "Blasphemy",
        ]
      `);
  });

  it("should fetch a user's works sorted by word count", async () => {
    const result = await getUserWorks({
      username: "chemicalcain",
      sortColumn: "word_count",
    });

    expect(result.filters.sortColumn).toBe("word_count");
    expect(result.works).toHaveLength(20);
    expect(result.works.slice(0, 5).map((work) => work.title))
      .toMatchInlineSnapshot(`
        [
          "What do you want?",
          "Something to focus on...",
          "Inflict Wounds",
          "Nothing is Whole and Nothing is Broken",
          "Who Can I Turn To?",
        ]
      `);
  });
});
