import { getWorkDetailsFromUrl, getWorkUrl } from "src/urls";

import assert from "assert";
import { getWork } from "src/index";

// TODO: this file is too long and should be split into multiple tests

describe("Fetches data from url", () => {
  test("Fetches work id from url", async () => {
    const workData = await getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  test("Fetches chapter id from url", async () => {
    const workData = await getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  test("Fetches collection from url", async () => {
    const workData = await getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
    });

    expect(workData).toMatchObject({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });
  });
});

describe("Gets url from data", () => {
  test("Gets url from workId", async () => {
    const workUrl = await getWorkUrl(
      getWorkDetailsFromUrl({
        url: "https://archiveofourown.org/works/36667228",
      })
    );

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  test("Gets url with chapter id", async () => {
    const workUrl = await getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  test("Gets url with collection name", async () => {
    const workUrl = await getWorkUrl({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/YJ_Prompts/works/30216801"
    );
  });
});

describe("Fetches work information", () => {
  test("Fetches work object in its entirety", async () => {
    const work = await getWork({
      workId: "29046888",
    });

    expect(work).toMatchObject({
      id: "29046888",
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
        "<p>“<i>Bakugou will know what to do</i>. Top of the class, always quick on his feet and possessing the strongest nerves in all of 1-A – all of U.A., possibly. They’re at their most invincible with Bakugou there to hone their focus, to push them forward with that unique kind of teeth-bared tenacity Kaminari has come to rely on in the past year. When Kaminari looks, he sees–</p><p>Iida, helmet off, severe face twisted with agitation as he argues with the medics on the scene. Blood, so much blood, staining the gleaming chrome of his armor up to his neck in wet, intersecting streaks of crimson.</p><p>And in his arms, mask torn and body limp, is Bakugou Katsuki.”</p><p>In which disaster strikes, the Bakusquad comes together as a family once more, and Kaminari Denki is the MVP all the way through.</p>",
      stats: {
        bookmarks: 173,
        comments: 110,
        hits: 10903,
        kudos: 664,
      },
    });
  });

  describe("Fetches work author", () => {
    test("Fetches author with default pseud", async () => {
      const work = await getWork({
        workId: "4491333",
      });

      assert(!work.locked);

      expect(work.authors).toMatchObject([
        {
          username: "astolat",
          pseud: "astolat",
        },
      ]);
    });

    test("Fetches author of work in anonymous collection", async () => {
      const work = await getWork({
        workId: "168768",
      });

      assert(!work.locked);

      expect(work.authors).toBe("Anonymous");
    });

    test("Fetches author with username Anonymous", async () => {
      const work = await getWork({
        workId: "6475531",
      });

      assert(!work.locked);

      expect(work.authors).toMatchObject([
        {
          username: "Anonymous",
          pseud: "Anonymous",
        },
        {
          username: "orphan_account",
          pseud: "orphan_account",
        },
      ]);
    });

    test("Fetches author with anonymous pseud", async () => {
      const work = await getWork({
        workId: "23824891",
      });

      assert(!work.locked);

      expect(work.authors).toMatchObject([
        {
          username: "orphan_account",
          pseud: "Anonymous",
        },
        {
          username: "Butterfly_Dream",
          pseud: "Butterfly_Dream",
        },
        {
          username: "mecchacumming",
          pseud: "mecchacumming",
        },
      ]);
    });

    test("Fetches author pseud with special characters", async () => {
      const work = await getWork({
        workId: "41237499",
      });

      assert(!work.locked);

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

  describe("Fetches work title", () => {
    test("Fetch work title with space character", async () => {
      const work = await getWork({
        workId: "23824891",
      });

      assert(!work.locked);

      expect(work.title).toBe("Sister Dearest");
    });

    test("Fetch title with slashes", async () => {
      const work = await getWork({
        workId: "29046888",
      });

      assert(!work.locked);

      expect(work.title).toBe("waiting//wishing");
    });

    test("Fetch title with non-letter characters", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.title).toBe("Field Test no.7: Phone Calls & Boundaries");
    });

    test.todo("Fetch title with special characters");
  });

  describe("Fetch work tags", () => {
    test("Fetch work warnings", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.tags.warnings).toMatchObject([
        "Creator Chose Not To Use Archive Warnings",
      ]);
    });

    test("Fetch work with multiple warnings", async () => {
      const work = await getWork({
        workId: "3738184",
      });

      assert(!work.locked);

      expect(work.tags.warnings).toMatchObject([
        "Creator Chose Not To Use Archive Warnings",
        "Graphic Depictions Of Violence",
        "Major Character Death",
        "No Archive Warnings Apply",
        "Rape/Non-Con",
        "Underage",
      ]);
    });

    test("Fetch work fandom", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.fandoms).toMatchObject(["The Mentalist"]);
    });

    test("Fetch work relationships", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.tags.relationships).toMatchObject([
        "Patrick Jane/Kimball Cho",
      ]);
    });

    test("Fetch work characters", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.tags.characters).toMatchObject([
        "Jane",
        "Kimball Cho",
        "The rest of the team",
      ]);
    });

    test("Fetch work additional tags", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.tags.additional).toMatchObject([]);
    });

    test("Fetch empty additional tags", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.tags.additional).toMatchObject([]);
    });
  });

  describe("Fetch other work information", () => {
    test("Fetch work wordcount", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.words).toBe(5652);
    });

    test("Fetch work language", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.language).toBe("English");
    });

    test("Fetch work rating", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.rating).toBe("Not Rated");
    });

    test("Fetch single category", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.category).toMatchObject(["M/M"]);
    });

    test("Fetch multiple categories", async () => {
      const work = await getWork({
        workId: "3738184",
      });

      assert(!work.locked);

      expect(work.category).toMatchObject([
        "F/F",
        "F/M",
        "Gen",
        "M/M",
        "Multi",
        "Other",
      ]);
    });

    test("Fetch null category", async () => {
      const work = await getWork({
        workId: "41237499",
      });

      assert(!work.locked);

      expect(work.category).toBe(null);
    });

    test("Fetch updated date of completed work", async () => {
      const work = await getWork({
        workId: "23824891",
      });

      assert(!work.locked);

      expect(work.updatedAt).toBe("2020-11-30");
    });

    test("Fetch update date of work in progress", async () => {
      const work = await getWork({
        workId: "41237499",
      });

      assert(!work.locked);

      expect(work.updatedAt).toBe("2022-08-25");
    });

    test("Fetch null updated date", async () => {
      const work = await getWork({
        workId: "168768",
      });

      assert(!work.locked);

      expect(work.updatedAt).toBe(null);
    });

    test("Fetch publish date", async () => {
      const work = await getWork({
        workId: "168768",
      });

      assert(!work.locked);

      expect(work.publishedAt).toBe("2011-02-08");
    });

    test("Fetch published chapters", async () => {
      const work = await getWork({
        workId: "168768",
      });

      assert(!work.locked);

      expect(work.chapters.published).toBe(1);
    });

    test("Fetch total chapters", async () => {
      const work = await getWork({
        workId: "168768",
      });

      assert(!work.locked);

      expect(work.chapters.total).toBe(1);
    });

    test("Fetch unknown amount of total chapters", async () => {
      const work = await getWork({
        workId: "41237499",
      });

      assert(!work.locked);

      expect(work.chapters.total).toBe(null);
    });

    test("Fetch null work summary", async () => {
      const work = await getWork({
        workId: "41237499",
      });

      assert(!work.locked);

      expect(work.summary).toBe(null);
    });

    test("Fetch a work summary", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.summary).toMatchInlineSnapshot(
        `"<p>Jane has had enough.</p>"`
      );
    });

    test("Fetch only work summary when work + chapter summaries are present", async () => {
      const work = await getWork({ workId: "17793689" });

      assert(!work.locked);

      expect(work.summary).toMatchInlineSnapshot(
        `"<p><b>A Modern Thedas AU</b>, in which Fen'Harel and the Second Inquisitor tore down the Veil a thousand years ago, reshaping Thedas into something entirely new. Thedas now has modern technology powered by magic, and a society still plagued with problems that are all too familiar - issues of race, classism, and power.</p><p>Fenina Lavellan, a student at the College of Enchanters: New Haven, often escapes her reality by playing the MMORPG Dragon Age (set in the ancient past during the time of the Second Inquisition) and is part of the most powerful guild aptly named "TheInquisition" - a guild which has been running since the game was released. But when the guild discovers that they all live in the same city and decide to meet up, they unknowingly stumble into a plot to destroy their world as they know it. Can they navigate the difficulties of actually being social in the real world? Will their in-game skills translate into abilities that will actually help them in stopping a madman? Or is this the end of the world as they know it?</p>"`
      );
      expect(work.chapterInfo).toBeNull();
    });

    test("Fetch work stats ", async () => {
      const work = await getWork({
        workId: "323217",
      });

      assert(!work.locked);

      expect(work.stats).toMatchObject({
        bookmarks: 65,
        comments: 27,
        hits: 5655,
        kudos: 460,
      });
    });
    test("Fetch stats when some are null", async () => {
      const work = await getWork({
        workId: "41289660",
      });

      assert(!work.locked);

      expect(work.stats).toMatchObject({
        bookmarks: 0,
        comments: 0,
        hits: 0,
        kudos: 0,
      });
    });
  });
});

describe("Checks status of a restricted work.", () => {
  test("Checks a known restricted work.", async () => {
    const work = await getWork({ workId: "15461226" });

    expect(work).toMatchObject({
      locked: true,
    });
  });
});
