import assert from "assert";
import { getWork } from "src/index";

describe("Fetches chapter of work", () => {
  describe("Fetches work + chapter object in its entirety", () => {
    test("Get chapter object with all fields", async () => {
      const work = await getWork({
        workId: "48582418",
        chapterId: "122861680",
      });

      assert(!work.locked);

      expect(work).toMatchObject({
        id: "48582418",
        authors: [
          { username: "rejected_bisexual", pseud: "rejected_bisexual" },
        ],
        title:
          "5 times Gotham (and everyone else except Bruce and Alfred) were Confused.",
        words: 4444,
        language: "English",
        rating: "Not Rated",
        category: null,
        adult: false,
        fandoms: ["Batman - All Media Types"],
        tags: {
          warnings: ["Creator Chose Not To Use Archive Warnings"],
          characters: [
            "Bruce Wayne",
            "Damian Wayne",
            "Tim Drake",
            "Cassandra Cain",
            "Jason Todd",
            "Dick Grayson",
            "Alfred Pennyworth",
          ],
          relationships: [
            "Bruce Wayne & Damian Wayne",
            "Tim Drake & Bruce Wayne",
            "Cassandra Cain & Bruce Wayne",
            "Jason Todd & Bruce Wayne",
            "Dick Grayson & Bruce Wayne",
            "Alfred Pennyworth & Bruce Wayne",
          ],
          additional: [
            "Fluff",
            "Misunderstandings",
            "Family Fluff",
            "Family Bonding",
            "Brotherly Bonding",
            "Inspired by Twitter",
            "Twitter",
            "Favorite child",
            "first fic be kind",
            "I'm Bad At Tagging",
            "no beta we die like jason todd",
            "Bruce Wayne is a Good Parent",
            "Crack Treated Seriously",
            "Crack that Tracks",
          ],
        },
        publishedAt: "2023-07-14",
        updatedAt: "2023-10-30",
        chapterInfo: {
          id: "122861680",
          index: 2,
          name: "2. Tim",
          summary:
            "<p>Bruce is in a Silly Goofy Mood.<br>Gotham is frustrated.<br>Tim needs love.</p>",
        },
        chapters: { published: 6, total: 6 },
        complete: true,
        series: [],
        stats: { bookmarks: 46, comments: 47, hits: 3, kudos: 256 },
        locked: false,
      });
    });

    test("Get chapter object without title or summary", async () => {
      const work = await getWork({
        workId: "37214506",
        chapterId: "92848687",
      });

      assert(!work.locked);

      expect(work).toMatchObject({
        id: "37214506",
        authors: "Anonymous",
        title: "AvengersGC",
        words: 11466,
        language: "English",
        rating: "Teen And Up Audiences",
        category: ["Gen"],
        adult: false,
        fandoms: ["Marvel Cinematic Universe"],
        tags: {
          warnings: ["No Archive Warnings Apply"],
          characters: [
            "Tony Stark",
            "Steve Rogers",
            "Natasha Romanov (Marvel)",
            "Clint Barton",
            "Bruce Banner",
            "Thor (Marvel)",
            'James "Rhodey" Rhodes',
            "Vision (Marvel)",
            "Wanda Maximoff",
            "T'Challa (Marvel)",
            "Scott Lang",
            "Sam Wilson (Marvel)",
            'James "Bucky" Barnes',
            "Peter Parker",
            "Shuri (Marvel)",
            "Kate Bishop",
            "Loki (Marvel)",
            "Sylvie (Loki TV)",
          ],
          relationships: ["Avengers Team & Avengers Team"],
          additional: [
            "Alternate Universe - Everyone Lives/Nobody Dies",
            "Fluff",
            "Chaos",
            "Chatting & Messaging",
            "Timeline What Timeline",
            "Texting",
            "I removed Pietro I'm sorry",
          ],
        },
        publishedAt: "2022-02-18",
        updatedAt: "2022-06-26",
        chapterInfo: { id: "92848687", index: 1, name: null, summary: null },
        chapters: { published: 20, total: null },
        complete: false,
        series: [{ id: "2946579", name: "Twitterchat Saga", index: 1 }],
        stats: { bookmarks: 12, comments: 29, hits: 2, kudos: 125 },
        locked: false,
      });
    });
  });

  test("Ensure chapter is null for single-chapter work", async () => {
    const work = await getWork({ workId: "168768", chapterId: "" });

    assert(!work.locked);

    expect(work).toMatchObject({
      id: "168768",
      authors: "Anonymous",
      title: "Fill",
      words: 447,
      language: "English",
      rating: "Teen And Up Audiences",
      category: ["Gen"],
      adult: false,
      fandoms: ["Homestuck"],
      tags: {
        warnings: ["Creator Chose Not To Use Archive Warnings"],
        characters: ["Equius Zahhak"],
        relationships: [
          "Nepeta Lejion♦Equius Zahhak",
          "Equius Zahhak♥Aradia Megido",
        ],
        additional: ["Prompt Fill"],
      },
      publishedAt: "2011-02-08",
      updatedAt: null,
      chapterInfo: null,
      chapters: { published: 1, total: 1 },
      complete: true,
      series: [],
      stats: { bookmarks: 1, comments: 1, hits: 938, kudos: 36 },
      locked: false,
    });
  });
});
