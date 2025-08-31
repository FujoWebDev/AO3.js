import { getWorkWithChapters } from "src/index";
import { describe, it, expect } from 'vitest';

describe("should fetch chapters list from", () => {
  it("work id", async () => {
    const workData = await getWorkWithChapters({ workId: "43703871" });

    expect(workData.title).toBe("Let The River Run");
    expect(workData.authors).toMatchObject([
      {
        username: "astolat",
        pseud: "astolat",
      },
    ]);
    expect(workData.workId).toBe("43703871");
    expect(workData.chapters).toMatchObject([
      {
        id: "109896639",
        index: 1,
        publishedAt: "2022-12-19",
        title: "Coming Through The Fog",
        url: "https://archiveofourown.org/works/43703871/chapters/109896639",
        workId: "43703871",
      },
      {
        id: "109943109",
        index: 2,
        publishedAt: "2022-12-20",
        title: "The Darkening Dawn",
        url: "https://archiveofourown.org/works/43703871/chapters/109943109",
        workId: "43703871",
      },
      {
        id: "109984306",
        index: 3,
        publishedAt: "2022-12-20",
        title: "Come Run With Me Now",
        url: "https://archiveofourown.org/works/43703871/chapters/109984306",
        workId: "43703871",
      },
      {
        id: "110032191",
        index: 4,
        publishedAt: "2022-12-21",
        title: "Trembling, Shaking",
        url: "https://archiveofourown.org/works/43703871/chapters/110032191",
        workId: "43703871",
      },
      {
        id: "110083590",
        index: 5,
        publishedAt: "2022-12-22",
        title: "Stand On A Star",
        url: "https://archiveofourown.org/works/43703871/chapters/110083590",
        workId: "43703871",
      },
      {
        id: "110133096",
        index: 6,
        publishedAt: "2022-12-23",
        title: "Blaze A Trail Of Desire",
        url: "https://archiveofourown.org/works/43703871/chapters/110133096",
        workId: "43703871",
      },
      {
        id: "110186152",
        index: 7,
        publishedAt: "2022-12-24",
        title: "Sirens Call Them On",
        url: "https://archiveofourown.org/works/43703871/chapters/110186152",
        workId: "43703871",
      },
      {
        id: "110240500",
        index: 8,
        publishedAt: "2022-12-25",
        title: "Running On The Water",
        url: "https://archiveofourown.org/works/43703871/chapters/110240500",
        workId: "43703871",
      },
      {
        id: "110242083",
        index: 9,
        publishedAt: "2022-12-25",
        title: "Epilogue (Silver Cities Rise)",
        url: "https://archiveofourown.org/works/43703871/chapters/110242083",
        workId: "43703871",
      },
    ]);
  });
});
