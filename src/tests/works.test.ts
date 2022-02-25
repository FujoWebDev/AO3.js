import { getWorkData, getWork } from "../index";
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

describe("Fetches work data", () => {
  test("Fetches required work data", async () => {
    const work = await getWork({
      workId: "37040272",
    });

    expect(work).toMatchObject({
      author: "Riazaia",
      title: "Solo lo Obligatorio",
      rating: ["Not Rated"],
      warning: ["No Archive Warnings Apply"],
      fandom: ["Testing"],
      language: "Español",
      published: "1969-06-09",
      words: "124",
      chapters: "1/1",
    });
  });
});
