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
    const workUrl = await getWorkUrl({
      workId: "36667228",
    });

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  test("Fetches url with chapter id ", async () => {
    const workUrl = await getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  test("Fetches url with collection name", async () => {
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

  test("Fetches work details", async () => {
    const work = await getWork({
      workId: "37040506",
    });
    expect(work).toMatchObject({
      author: "Anonymous",
      title: "Exceso de Cosas",
      language: "Español",
      published: new Date(Date.parse("1969-06-09")),
      words: "124",
      publishedChapters: 1,
      totalChapters: null,
      series: "Part 1 of the Testing series",
      collections:
        "Testing Purposes, aaaaaaa a test brrrr goes the test, Anonymous",
      updated: new Date(Date.parse("1969-06-09")),
    });
  });

  test("Fetches category and tags", async () => {
    const work = await getWork({
      workId: "37040506",
    });
    expect(work).toMatchObject({
      rating: ["Not Rated"],
      warning: [
        "Creator Chose Not To Use Archive Warnings",
        "Graphic Depictions Of Violence",
        "Major Character Death",
        "No Archive Warnings Apply",
        "Rape/Non-Con",
        "Underage",
      ],
      fandom: ["Testing"],
      category: ["F/F", "F/M", "Gen", "M/M", "Multi", "Other"],
      relationship: ["Me/My Need To Be Obsessive"],
      character: ["Me", "This Website"],
      freeform: ["This Is STUPID"],
    });
  });

  test("Fetches dates", async () => {
    const work = await getWork({
      workId: "5468561",
    });
    expect(work).toMatchObject({
      published: new Date(Date.parse("2015-12-20")),
    });
  });

  xtest("Returns the right thing for missing fields", async () => {
    const work = await getWork({
      workId: "37040272",
    });
    expect(work).toMatchObject({
      category: [],
      relationship: [],
      character: [],
      freeform: [],
      totalChapters: null,
      series: null,
      collections: null,
      updated: null,
    });
  });
});
