import { getWorkDetailsFromUrl, getWorkUrl } from "src/urls";
import { getWork } from "src/index";
import { describe, it, expect } from "vitest";
import type { WorkSummary } from "types/entities";
// TODO: this file is too long and should be split into multiple tests

describe("Works/parse", () => {
  it("should parse work id from url", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  it("should parse chapter id from url", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  it("should parse collection from url", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
    });

    expect(workData).toMatchObject({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });
  });
});

describe("Works/url", () => {
  it("should get url from workId", () => {
    const workUrl = getWorkUrl(
      getWorkDetailsFromUrl({
        url: "https://archiveofourown.org/works/36667228",
      })
    );

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  it("should get url from chapter id", () => {
    const workUrl = getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  it("should get url from collection name", () => {
    const workUrl = getWorkUrl({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/YJ_Prompts/works/30216801"
    );
  });
});

describe("Works/data", () => {
  it('should fetch work information in its entirety', async () => {
    const work = await getWork({
      workId: "29046888",
    });

    expect(work).toMatchObject({
      id: 29046888,
      authors: [{ username: "KBstories", pseud: "KBstories" }],
      title: "waiting//wishing",
      words: 36352,
      language: "English",
      rating: "Mature",
      category: ["Gen", "F/M"],
      fandoms: [
        "僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia",
      ],
      tags: {
        warnings: ["Graphic Depictions Of Violence"],
        characters: [
          "Kaminari Denki",
          "Bakugou Katsuki",
          "Kirishima Eijirou",
          "Jirou Kyouka",
          "Sero Hanta",
          "Ashido Mina",
          "Yamada Hizashi | Present Mic",
          "Class 1-A (My Hero Academia)",
        ],
        relationships: [
          "Bakugou Katsuki/Kirishima Eijirou",
          "Jirou Kyouka/Kaminari Denki",
          "Bakugou Katsuki & Kaminari Denki",
          "Ashido Mina & Bakugou Katsuki & Jirou Kyouka & Kaminari Denki & Kirishima Eijirou & Sero Hanta",
        ],
        additional: [
          "Post-Paranormal Liberation War Arc (My Hero Academia)",
          "Developing Friendships",
          "Character Study",
          "Injury Recovery",
          "Protective Bakusquad (My Hero Academia)",
          "Queerplatonic Relationships",
          "POV Kaminari Denki",
          "the romance is There but it's not the point (the point is found family)",
          "Medical Inaccuracies",
          "Some Fluff",
          "Asexual Bakugou Katsuki",
          "Post-Traumatic Stress Disorder - PTSD",
          "@ U.A. give these kids proper therapy or die by my sword",
          "Hurt/Comfort",
          "Angst with a Happy Ending",
          "Bakusquad-centric (My Hero Academia)",
          "Hospitals",
          "Anxiety",
          "POV Bakugou Katsuki",
          "(epilogue only)",
          "Canon compliant up to CH306",
          "Hurt Bakugou Katsuki",
        ],
      },
      publishedAt: "2021-01-28",
      updatedAt: "2021-03-03",
      chapters: {
        published: 7,
        total: 7,
      },
      summary:
        "<p>&#x201c;<i>Bakugou will know what to do</i>. Top of the class, always quick on his feet and possessing the strongest nerves in all of 1-A &#x2013; all of U.A., possibly. They&#x2019;re at their most invincible with Bakugou there to hone their focus, to push them forward with that unique kind of teeth-bared tenacity Kaminari has come to rely on in the past year. When Kaminari looks, he sees&#x2013;</p><p>Iida, helmet off, severe face twisted with agitation as he argues with the medics on the scene. Blood, so much blood, staining the gleaming chrome of his armor up to his neck in wet, intersecting streaks of crimson.</p><p>And in his arms, mask torn and body limp, is Bakugou Katsuki.&#x201d;</p><p>In which disaster strikes, the Bakusquad comes together as a family once more, and Kaminari Denki is the MVP all the way through.</p>",
      stats: {
        "bookmarks": expect.any(Number),
        "comments": expect.any(Number),
        "hits": expect.any(Number),
        "kudos": expect.any(Number),
      },
    });
  });
})

describe("Works/author", () => {
  it("should fetch work author with default pseud", async () => {
    const work = await getWork({
      workId: "4491333",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.authors).toMatchObject([
      {
        username: "astolat",
        pseud: "astolat",
      },
    ]);
  });

  it("should fetch work author of work in anonymous collection", async () => {
    const work = await getWork({
      workId: "168768",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.authors).toMatchObject([
      { anonymous: true, pseud: "Anonymous", username: "Anonymous" },
    ]);
  });

  it("should fetch work author with username Anonymous", async () => {
    const work = await getWork({
      workId: "6475531",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.authors).toMatchObject([
      {
        username: "Anonymous",
        pseud: "Anonymous",
        anonymous: false,
      },
      {
        username: "orphan_account",
        pseud: "orphan_account",
      },
    ]);
  });

  it("should fetch work author with anonymous pseud", async () => {
    const work = await getWork({
      workId: "23824891",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.authors).toMatchObject([
      {
        username: "orphan_account",
        pseud: "Anonymous",
        anonymous: false,
      },
      {
        username: "Butterfly_Dream",
        pseud: "Butterfly_Dream",
      },
      {
        username: "orphan_account",
        pseud: "orphan_account",
      },
    ]);
  });

  // TODO: 404
  it.skip("should fetch work author pseud with special characters", async () => {
    const work = await getWork({
      workId: "41237499",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.authors).toMatchObject([
      {
        username: "Riazaia",
        pseud: "Riazaia",
      },
      {
        username: "Riazaia",
        pseud: "ᴾᴋᴹɴ Ria",
      },
    ]);
  });
});

describe("Works/title", () => {
  it("should fetch work title with space character", async () => {
    const work = await getWork({
      workId: "23824891",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.title).toBe("Sister Dearest");
  });

  it("should fetch work title with slashes", async () => {
    const work = await getWork({
      workId: "29046888",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.title).toBe("waiting//wishing");
  });

  it("should fetch work title with non-letter characters", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.title).toBe("Field Test no.7: Phone Calls & Boundaries");
  });

  it.todo("should fetch work title with special characters");
});

describe("Works/tags", () => {
  it("should fetch warning tags", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.warnings).toMatchObject([
      "Creator Chose Not To Use Archive Warnings",
    ]);
  });

  it("should fetch multiple warnings", async () => {
    const work = await getWork({
      workId: "3738184",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.warnings).toMatchObject([
      "Creator Chose Not To Use Archive Warnings",
      "Graphic Depictions Of Violence",
      "Major Character Death",
      "No Archive Warnings Apply",
      "Rape/Non-Con",
      "Underage Sex",
    ]);
  });

  it("should fetch fandom", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.fandoms).toMatchObject(["The Mentalist"]);
  });

  it("should fetch relationships", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.relationships).toMatchObject([
      "Patrick Jane/Kimball Cho",
    ]);
  });

  it("should fetch characters", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.characters).toMatchObject([
      "Jane",
      "Kimball Cho",
      "The rest of the team",
    ]);
  });

  it("ashould fetch dditional tags", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.additional).toMatchObject([]);
  });

  it("should fetch empty additional tags", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.tags.additional).toMatchObject([]);
  });
});

describe("Work/other", () => {
  it("should fetch wordcount", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.words).toBe(5652);
  });

  it("should fetch language", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.language).toBe("English");
  });

  it("should fetch rating", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.rating).toBe("Not Rated");
  })

  it("should fetch category", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.category).toMatchObject(["M/M"]);
  });

  it("should fetch multiple categories", async () => {
    const work = await getWork({
      workId: "3738184",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.category).toMatchObject([
      "F/F",
      "F/M",
      "Gen",
      "M/M",
      "Multi",
      "Other",
    ]);
  });

  // TODO: 404
  it.skip("should fetch null category", async () => {
    const work = await getWork({
      workId: "41237499",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.category).toBe(null);
  });

  it("should fetch updated date of completed work", async () => {
    const work = await getWork({
      workId: "23824891",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.updatedAt).toBe("2020-11-30");
  });

  // TODO: 404
  it.skip("should fetch update date of work in progress", async () => {
    const work = await getWork({
      workId: "41237499",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.updatedAt).toBe("2022-08-25");
  });

  it("should fetch null updated date", async () => {
    const work = await getWork({
      workId: "168768",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.updatedAt).toBe(null);
  });

  it("should fetch publish date", async () => {
    const work = await getWork({
      workId: "168768",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.publishedAt).toBe("2011-02-08");
  });

  it("should fetch published chapters", async () => {
    const work = await getWork({
      workId: "168768",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.chapters.published).toBe(1);
  });

  it("should fetch total chapters", async () => {
    const work = await getWork({
      workId: "168768",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.chapters.total).toBe(1);
  });

  // TODO: 404
  it.skip("should fetch unknown amount of total chapters", async () => {
    const work = await getWork({
      workId: "41237499",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.chapters.total).toBe(null);
  });

  // TODO: 404
  it.skip("should fetch null work summary", async () => {
    const work = await getWork({
      workId: "41237499",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.summary).toBe(null);
  });

  it("should fetch work summary", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.summary).toMatchInlineSnapshot(
      `"<p>Jane has had enough.</p>"`
    );
  });

  it("should fetch only work summary when work + chapter summaries are present", async () => {
    const work = await getWork({ workId: "17793689" }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.summary).toMatchInlineSnapshot(
      `"<p><b>A Modern Thedas AU</b>, in which Fen&apos;Harel and the Second Inquisitor tore down the Veil a thousand years ago, reshaping Thedas into something entirely new. Thedas now has modern technology powered by magic, and a society still plagued with problems that are all too familiar - issues of race, classism, and power.</p><p>Fenina Lavellan, a student at the College of Enchanters: New Haven, often escapes her reality by playing the MMORPG Dragon Age (set in the ancient past during the time of the Second Inquisition) and is part of the most powerful guild aptly named &quot;TheInquisition&quot; - a guild which has been running since the game was released. But when the guild discovers that they all live in the same city and decide to meet up, they unknowingly stumble into a plot to destroy their world as they know it. Can they navigate the difficulties of actually being social in the real world? Will their in-game skills translate into abilities that will actually help them in stopping a madman? Or is this the end of the world as they know it?</p>"`
    );
    expect(work.chapterInfo).toBeNull();
  });

  it("should fetch stats ", async () => {
    const work = await getWork({
      workId: "323217",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.stats).toMatchObject({
      bookmarks: expect.any(Number),
      comments: expect.any(Number),
      hits: expect.any(Number),
      kudos: expect.any(Number),
    });
  });

  it("should fetch stats when some are null", async () => {
    const work = await getWork({
      workId: "41289660",
    }) as WorkSummary;

    expect(!work.locked).toBeTruthy();

    expect(work.stats).toMatchObject({
      bookmarks: expect.any(Number),
      comments: 0,
      hits: expect.any(Number),
      kudos: expect.any(Number),
    });
  });
});

describe("Work/restricted", () => {
  it("should check status of a restricted work.", async () => {
    const work = await getWork({ workId: "15461226" }) as WorkSummary;

    expect(work).toMatchObject({
      id: 15461226,
      locked: true,
    });
  });
})
