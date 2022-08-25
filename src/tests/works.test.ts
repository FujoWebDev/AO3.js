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

describe("Fetches work summary", () => {
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

  test("Fetch work category", async () => {
    const work = await getWork({
      workId: "323217",
    });

    expect(work.category).toMatchObject(["M/M"]);
  });

  test("Fetch null work category", async () => {
    const work = await getWork({
      workId: "41237499",
    });

    expect(work.category).toBe(null);
  });
});
