import { getWorkDetailsFromUrl, getWorkUrl } from "src/urls";
import { describe, it, expect } from 'vitest';
import { initSetup } from "./setup";

initSetup()

describe("Fetches data from url", () => {
  it("Fetches work id from url", async () => {
    const workData = await getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  it("Fetches chapter id from url", async () => {
    const workData = await getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  it("Fetches collection from url", async () => {
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
  it("Gets url from workId", async () => {
    const workUrl = await getWorkUrl(
      getWorkDetailsFromUrl({
        url: "https://archiveofourown.org/works/36667228",
      })
    );

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  it("Fetches chapter id from url", async () => {
    const workUrl = await getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  it("Fetches collection from url", async () => {
    const workUrl = await getWorkUrl({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/YJ_Prompts/works/30216801"
    );
  });
});
