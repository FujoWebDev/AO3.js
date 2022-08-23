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

  test("Fetches chapter id from url", async () => {
    const workUrl = await getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  test("Fetches collection from url", async () => {
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
});
