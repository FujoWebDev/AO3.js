import { getWorkDetailsFromUrl, getWorkUrl } from "src/urls";
import { describe, it, expect } from 'vitest';

describe("Urls/parse", () => {
  it("should parse work id", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/36667228",
    });

    expect(workData).toMatchObject({
      workId: "36667228",
    });
  });

  it("should parse chapterId", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/works/398023/chapters/659774",
    });

    expect(workData).toMatchObject({
      workId: "398023",
      chapterId: "659774",
    });
  });

  it("should parse collection", () => {
    const workData = getWorkDetailsFromUrl({
      url: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
    });

    expect(workData).toMatchObject({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });
  });
});

describe("Urls/fetch", () => {
  it("should fetch workId", () => {
    const workUrl = getWorkUrl(
      getWorkDetailsFromUrl({
        url: "https://archiveofourown.org/works/36667228",
      })
    );

    expect(workUrl).toBe("https://archiveofourown.org/works/36667228");
  });

  it("should fetch chapterId", () => {
    const workUrl = getWorkUrl({
      workId: "398023",
      chapterId: "659774",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/works/398023/chapters/659774"
    );
  });

  it("should fetch collection", () => {
    const workUrl = getWorkUrl({
      workId: "30216801",
      collectionName: "YJ_Prompts",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/YJ_Prompts/works/30216801"
    );
  });
});
