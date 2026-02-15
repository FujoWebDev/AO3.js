import { describe, expect, it } from "vitest";

import type { WorkSummary } from "types/entities";
import { getWork } from "src/index";

describe("Work Chapter/chapter", () => {
  it("should use null for single-chapter work", async () => {
    const work = await getWork({ workId: 168768 });

    expect(!work.locked).toBeTruthy();

    expect(work).toMatchObject({
      id: 168768,
      authors: [
        {
          username: "Anonymous",
          pseud: "Anonymous",
          anonymous: true,
        },
      ],
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
      locked: false,
    });

    expect((work as WorkSummary).stats).toMatchInlineSnapshot(`
      {
        "bookmarks": 2,
        "comments": 1,
        "hits": 1028,
        "kudos": 47,
      }
    `);
  });

  it("should have different work summary and chapter summary", async () => {
    const work = (await getWork({
      workId: 17793689,
      chapterId: 41980418,
    })) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.summary).toMatchInlineSnapshot(
      `"<p><b>A Modern Thedas AU</b>, in which Fen&apos;Harel and the Second Inquisitor tore down the Veil a thousand years ago, reshaping Thedas into something entirely new. Thedas now has modern technology powered by magic, and a society still plagued with problems that are all too familiar - issues of race, classism, and power.</p><p>Fenina Lavellan, a student at the College of Enchanters: New Haven, often escapes her reality by playing the MMORPG Dragon Age (set in the ancient past during the time of the Second Inquisition) and is part of the most powerful guild aptly named &quot;TheInquisition&quot; - a guild which has been running since the game was released. But when the guild discovers that they all live in the same city and decide to meet up, they unknowingly stumble into a plot to destroy their world as they know it. Can they navigate the difficulties of actually being social in the real world? Will their in-game skills translate into abilities that will actually help them in stopping a madman? Or is this the end of the world as they know it?</p>"`,
    );
    expect(work.chapterInfo?.summary).toMatchInlineSnapshot(
      `"<p>Fenina Lavellan&apos;s MMO guild discovers they all live closer than they thought and decides to meet up.</p>"`,
    );
  });
});

describe("Work Chapter/work", () => {
  it("should fetch work + chapter object with all fields", async () => {
    const work = await getWork({
      workId: 48582418,
      chapterId: 122861680,
    });

    expect(!work.locked).toBeTruthy();

    expect(work).toMatchObject({
      id: 48582418,
      authors: [{ username: "rejected_bisexual", pseud: "rejected_bisexual" }],
      title:
        "5 times Gotham (and everyone else except Bruce and Alfred) were Confused.",
      words: 4444,
      language: "English",
      rating: "Not Rated",
      category: null,
      adult: true,
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
        id: 122861680,
        index: 2,
        name: "2. Tim",
        summary:
          "<p>Bruce is in a Silly Goofy Mood.<br>Gotham is frustrated.<br>Tim needs love.</p>",
      },
      chapters: { published: 6, total: 6 },
      complete: true,
      series: [],
      stats: {
        bookmarks: expect.any(Number),
        comments: expect.any(Number),
        hits: expect.any(Number),
        kudos: expect.any(Number),
      },
      locked: false,
    });
  });

  it("should fetch chapter object without title or summary", async () => {
    const work = (await getWork({
      workId: 37214506,
      chapterId: 92848687,
    })) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work).toMatchObject({
      id: 37214506,
      authors: [
        {
          username: "Anonymous",
          pseud: "Anonymous",
          anonymous: true,
        },
      ],
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
      chapterInfo: { id: 92848687, index: 1, name: null, summary: null },
      chapters: { published: 20, total: null },
      complete: false,
      series: [{ id: 2946579, name: "Twitterchat Saga", index: 1 }],
      stats: {
        bookmarks: expect.any(Number),
        comments: 29,
        hits: expect.any(Number),
        kudos: expect.any(Number),
      },
      locked: false,
    });

    expect(work.stats.bookmarks).toBeGreaterThanOrEqual(14);
    expect(work.stats.bookmarks).toBeLessThanOrEqual(20);

    expect(work.stats.kudos).toBeGreaterThanOrEqual(131);
    expect(work.stats.kudos).toBeLessThanOrEqual(141);
  });
});
