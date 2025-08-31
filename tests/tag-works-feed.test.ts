import { getWorkDetailsFromUrl, getWorkUrl } from "src/urls";
import { describe, it, expect } from 'vitest';
import { initSetup } from "./setup";

initSetup()

describe("should fetch data from url", () => {
  it("work id", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  it("chapter id", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  it("collection", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
    });

    expect(workData).toMatchObject({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });
  });
});

describe("should get url from data", () => {
  it("workId", () => {
    const workUrl = getWorkUrl(
      getWorkDetailsFromUrl({
        url: "https://archiveofourown.org/works/36667228",
      })
    );

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  it("chapterId", () => {
    const workUrl = getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  it("collection", () => {
    const workUrl = getWorkUrl({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/YJ_Prompts/works/30216801"
    );
  });
});
