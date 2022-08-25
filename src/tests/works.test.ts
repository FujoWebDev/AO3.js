import { getWork, getWorkData } from "../index";

import { getWorkUrl } from "../utils/works";

describe("Fetches data from url", () => {
  test("Fetches work id from url", async () => {
    const workData = await getWorkData({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  test("Fetches chapter id from url", async () => {
    const workData = await getWorkData({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  test("Fetches collection from url", async () => {
    const workData = await getWorkData({
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
      getWorkData({
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

describe("Fetches work summary", () => {
  describe("Fetches work author", () => {
    test("Fetches author with default pseud", async () => {
      const work = await getWork({
        workId: "4491333",
      });

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

      expect(work.authors).toBe("Anonymous");
    });

    test("Fetches author with username Anonymous", async () => {
      const work = await getWork({
        workId: "6475531",
      });

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

      expect(work.authors).toMatchObject([
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

      expect(work.title).toBe("Sister Dearest");
    });

    test("Fetch title with slashes", async () => {
      const work = await getWork({
        workId: "29046888",
      });

      expect(work.title).toBe("waiting//wishing");
    });

    test("Fetch title with non-letter characters", async () => {
      const work = await getWork({
        workId: "323217",
      });

      expect(work.title).toBe("Field Test no.7: Phone Calls & Boundaries");
    });

    test.todo("Fetch title with special characters");
  });

  test("Fetch work wordcount", async () => {
    const work = await getWork({
      workId: "323217",
    });

    expect(work.words).toBe(5652);
  });

  test("Fetch work language", async () => {
    const work = await getWork({
      workId: "323217",
    });

    expect(work.language).toBe("English");
  });

  test("Fetch work rating", async () => {
    const work = await getWork({
      workId: "323217",
    });

    expect(work.rating).toBe("Not Rated");
  });

  test("Fetch single category", async () => {
    const work = await getWork({
      workId: "323217",
    });

    expect(work.category).toMatchObject(["M/M"]);
  });

  test("Fetch multiple categories", async () => {
    const work = await getWork({
      workId: "3738184",
    });

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

    expect(work.category).toBe(null);
  });

  describe("Fetch work tags", () => {
    test("Fetch work warnings", async () => {
      const work = await getWork({
        workId: "323217",
      });

      expect(work.tags.warnings).toMatchObject([
        "Creator Chose Not To Use Archive Warnings",
      ]);
    });

    test("Fetch work with multiple warnings", async () => {
      const work = await getWork({
        workId: "3738184",
      });

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

      expect(work.fandoms).toMatchObject(["The Mentalist"]);
    });

    test("Fetch work relationships", async () => {
      const work = await getWork({
        workId: "323217",
      });

      expect(work.tags.relationships).toMatchObject([
        "Patrick Jane/Kimball Cho",
      ]);
    });

    test("Fetch work characters", async () => {
      const work = await getWork({
        workId: "323217",
      });

      expect(work.tags.characters).toMatchObject([
        "Jane",
        "Kimball Cho",
        "The rest of the team",
      ]);
    });

    test("Fetch work additional tags", async () => {
      const work = await getWork({
        workId: "29046888",
      });

      expect(work.tags.additional).toMatchObject([
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
      ]);
    });

    test("Fetch empty additional tags", async () => {
      const work = await getWork({
        workId: "323217",
      });

      expect(work.tags.additional).toMatchObject([]);
    });
  });
});
