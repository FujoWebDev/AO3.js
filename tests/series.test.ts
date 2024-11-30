import { getSeries } from "src/index";

// TODO: Add more tests

describe("Fetches series information", () => {
  test("Fetches series object, checks top level fields", async () => {
    const series = await getSeries({ seriesId: "2270465" });

    expect(series).toMatchObject({
      id: "2270465",
      name: "OG Titan",
      startedAt: "2021-04-11",
      updatedAt: "2023-02-13",
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      description:
        "<p>My potentially related stories about the relationship between the OG Titans. Probably focused on Dick Grayson.</p>",
      notes: null,
      words: 30035,
      bookmarks: 214,
      complete: false,
      workCount: 6, 
    });
  });

  test("Fetches series object, check works", async () => {
    const series = await getSeries({ seriesId: "2270465" });

    // Work 1
    expect(series.works[0]).toMatchObject({
      id: "30604247",
      title: "Away from all of Reality",
      updatedAt: "2021-04-11",
      adult: false,
      fandoms: [
        "Batman - All Media Types",
        "Teen Titans (Comics)",
        "Nightwing (Comics)",
      ],
      tags: {
        characters: ["Dick Grayson", "Donna Troy"],
        relationships: [
          "Dick Grayson & Donna Troy",
          "Dick Grayson & Damian Wayne",
        ],
        additional: [
          "Dick Grayson Deserves Better",
          "Hurt No Comfort",
          "Protective Donna Troy",
          "BAMF Donna Troy",
          "Dick Grayson doesn't have a super - He has Ma and Pa Kent",
          "Dick Grayson is Not Okay",
          "Donna Troy is president of the",
          "#DickGraysonProtectionSquad",
          "Bruce Wayne is a Bad Parent",
          "Author might have some unresolved issues with Babs",
          "You'll see what I mean",
          "There are events in cannon that I can't get over and it shows",
          "Same with Bruce",
          "Wally West would be their secret keeper",
          "Damian would have an open invite to visit",
          "Daydreaming",
          "Donna Troy POV",
          "wonder twins",
          "Hurt Dick Grayson",
          "Dick Grayson-centric",
          "Garth and Wally will still come for brunch twice a month",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 2733,
      chapters: { published: 1, total: 1 },
      complete: true,
      stats: { bookmarks: 208, kudos: 1324, hits: expect.any(Number) },
    });

    // // Work 2
    expect(series.works[1]).toMatchObject({
      id: "30794750",
      title: "Code B",
      updatedAt: "2023-02-01",
      adult: false,
      fandoms: [
        "Batman - All Media Types",
        "Nightwing (Comics)",
        "Teen Titans (Comics)",
        "Red Hood and the Outlaws (Comics)",
      ],
      tags: {
        characters: [
          "Dick Grayson",
          "Garth (DCU)",
          "Donna Troy",
          "Wally West",
          "Roy Harper",
          "Jason Todd",
          "Alfred Pennyworth",
        ],
        relationships: [
          "Dick Grayson & Donna Troy",
          "Dick Grayson & Wally West",
          "Garth & Dick Grayson & Roy Harper & Donna Troy & Wally West",
          "Garth & Dick Grayson",
          "Roy Harper & Jason Todd",
          "Dick Grayson & Damian Wayne",
          "Alfred Pennyworth & Jason Todd",
          "Dick Grayson & Roy Harper",
          "Dick Grayson & Amy Rohrbach",
          "Catalina Flores/Dick Grayson",
        ],
        additional: [
          "Hurt Dick Grayson",
          "Dick Grayson Needs a Hug",
          "Protective Wally West",
          "Team as Family",
          "Roy Harper Needs a Hug",
          "Bruce Wayne is a Bad Parent",
          "The problem with not getting all the information is you don't have all the information",
          "A moment of clarity by Roy Harper",
          "wonder twins",
          "Jason Todd Needs A Hug",
          "Dick Grayson Did Not Fake His Death",
          "Dick Grayson is Not Okay",
          "Dick Grayson-centric",
          "Alfred Pennyworth isn’t perfect but is trying his best and is significantly better than Bruce",
          "Former drug addict Roy Harper",
          "Mentioned Catalina Flores",
          "Dick Grayson & Wally West Friendship",
          "Protective Team",
          "Past Rape/Non-con",
          "Amy Rohrbach is a good friend",
          "Roy Harper needs a swear jar",
          "Blink and you miss it reference to...",
          "Evil Slade Wilson",
          "Creepy Slade Wilson",
          "Implied/Referenced Rape/Non-con",
          "Like the city of Rome your positive mental health cant be built in a day",
          "Also like Rome your mental health can be destroyed in hours",
          "All about Dick Grayson and he doesn't even show up until chapter 11",
          "Dick Grayson & Donna Troy Friendship",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 17141,
      chapters: { published: 12, total: null },
      complete: false,
      stats: { bookmarks: 644, kudos: 3032, hits: expect.any(Number) },
    });

    // // Work 3
    expect(series.works[2]).toMatchObject({
      id: "30914645",
      title: "Donna Troy Loves You",
      updatedAt: "2021-04-26",
      adult: false,
      fandoms: [
        "Nightwing (Comics)",
        "Batman - All Media Types",
        "Teen Titans (Comics)",
      ],
      tags: {
        characters: ["Dick Grayson", "Donna Troy", "Cassandra Cain"],
        relationships: [
          "Dick Grayson & Donna Troy",
          "Cassandra Cain & Dick Grayson",
          "Dick Grayson & Alfred Pennyworth",
          "Batfamily Members & Dick Grayson",
        ],
        additional: [
          "Protective Donna Troy",
          "Good Sibling Cassandra Cain",
          "Caring Cassandra Cain",
          "Dick Grayson is Nightwing",
          "Dick Grayson Needs a Hug",
          "BAMF Dick Grayson",
          "Dick Grayson Gets a Hug",
          "Bruce Wayne Tries to Be a Good Parent",
          "Good Grandparent Alfred Pennyworth",
          "Mentioned Catalina Flores",
          "Implied/Referenced Rape/Non-con",
          "Jealous Barbara Gordon",
          "Dick Grayson Needs Therapy",
          "Hurt Dick Grayson",
          "#DickGraysonProtectionSquad",
          "Bruce Wayne C+ Parenting",
          "Alfred Pennyworth is a Saint",
          "Dick Grayson-centric",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 3021,
      chapters: { published: 1, total: 1 },
      complete: true,
      stats: { bookmarks: 242, kudos: 1539, hits: expect.any(Number) },
    });

    // // Work 4
    expect(series.works[3]).toMatchObject({
      id: "31221131",
      title: "Rockin Robin",
      updatedAt: "2021-05-11",
      adult: false,
      fandoms: ["Teen Titans (Comics)", "Batman - All Media Types"],
      tags: {
        characters: [
          "Garth (DCU)",
          "Dick Grayson",
          "Donna Troy",
          "Roy Harper",
          "Wally West",
          "Guest staring:",
          "Barbara Gordon",
          "Tim Drake",
        ],
        relationships: [
          "Garth & Dick Grayson & Roy Harper & Donna Troy & Wally West",
        ],
        additional: [
          "The Titans were a band",
          "Dick on vocals and guitar",
          "Donna on vocals and guitar",
          "Roy on bass guitar",
          "Wally on drums",
          "Garth on piano",
          "Twitter",
          "Will there be more? Probably",
          "Team as Family",
          "wonder twins",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 832,
      chapters: { published: 1, total: 1 },
      complete: true,
      stats: { bookmarks: 81, kudos: 683, hits: expect.any(Number) },
    });

    // // Work 5
    expect(series.works[4]).toMatchObject({
      id: "35757790",
      title: "Realistic Exit Strategy",
      updatedAt: "2023-02-13",
      adult: false,
      fandoms: [
        "Teen Titans (Comics)",
        "Nightwing (Comics)",
        "Batman - All Media Types",
      ],
      tags: {
        characters: [
          "Dick Grayson",
          "Donna Troy",
          "Wally West",
          "Garth (DCU)",
          "Diana (Wonder Woman)",
          "Clark Kent",
          "Roy Harper",
        ],
        relationships: [
          "Dick Grayson & Donna Troy",
          "Garth & Dick Grayson & Roy Harper & Donna Troy & Wally West",
          "Diana (Wonder Woman) & Dick Grayson",
          "Dick Grayson & Clark Kent",
        ],
        additional: [
          "Dick Grayson Needs a Hug",
          "Dick Grayson Needs Help",
          "Dick Grayson Has Issues",
          "Illnesses",
          "Hurt/Comfort",
          "Unhealthy Coping Mechanisms",
          "Dick Grayson Deserves Better",
          "Protective Donna Troy",
          "Good Friend Donna Troy",
          "Jason Todd is Bad at Feelings",
          "Tim Drake is Bad at Feelings",
          "No Beta",
          "no beta we die like robins",
          "Lack of Communication",
          "Hurt Dick Grayson",
          "wonder twins",
          "Dick Grayson-centric",
          "Team as Family",
          "Medical Inaccuracies",
          "Protective Wally West",
          "Protective Garth (DCU)",
          "Good Uncle Clark Kent",
          "Good Aunt Diana Prince",
          "Roy Harper comes around",
          "Good Friend Roy Harper",
          "Medical inaccuracies like whoa",
          "Don't need to read part one",
          "but it might help.",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 5718,
      chapters: { published: 2, total: 3 },
      complete: false,
      stats: { bookmarks: 197, kudos: 1197, hits: expect.any(Number) },
    });

    // // Work 6
    expect(series.works[5]).toMatchObject({
      id: "44149795",
      title: "You starting down the road leaving me again",
      updatedAt: "2023-01-08",
      adult: false,
      fandoms: [
        "Batman - All Media Types",
        "Nightwing (Comics)",
        "Titans (Comics)",
      ],
      tags: {
        characters: [
          "Dick Grayson",
          "Donna Troy",
          "Garth (DCU)",
          "Roy Harper",
          "Wally West",
        ],
        relationships: [
          "Garth & Dick Grayson & Roy Harper & Donna Troy & Wally West",
        ],
        additional: [
          "Teen Titans as Family",
          "Titans",
          "Team as Family",
          "Karaoke",
          "Dick Grayson Needs a Hug",
          "Blüdhaven",
          "Hurt Dick Grayson",
          "Emotional Hurt",
          "Found Family",
          "Parent Roy Harper",
          "Mentioned Linda Park",
          "would this count as",
          "Dick Grayson-centric",
          "What do you think they sing?",
          "The boys probably do a boy band",
          "They lost a bet to Donna",
          "No actual singing",
          "No Plot/Plotless",
          "Random & Short",
          "Author Is Sleep Deprived",
          "Author needed something sweet",
        ],
      },
      authors: [{ username: "MyHero", pseud: "MyHero" }],
      language: "English",
      words: 590,
      chapters: { published: 1, total: 1 },
      complete: true,
      stats: { bookmarks: 41, kudos: 346, hits: expect.any(Number) },
    });
  });

  test("Fetches author with username Anonymous", async () => {
    const series = await getSeries({ seriesId: "2946579" });
    expect(series.authors).toMatchObject([
      { anonymous: true, pseud: "Anonymous", username: "Anonymous" },
    ]);
  });

  describe("Fetches series title", () => {
    test("Fetch series title with space character", async () => {
      const series = await getSeries({
        seriesId: "2270465",
      });

      expect(series.name).toBe("OG Titan");
    });

    test("Fetch series with slashes", async () => {
      const series = await getSeries({
        seriesId: "1728802",
      });

      expect(series.name).toBe("angsty oneshots/short stories");
    });

    test("Fetch series with non-letter characters", async () => {
      const series = await getSeries({
        seriesId: "2817877",
      });

      expect(series.name).toBe("*Insert Fandom* but Social Media (one-shots)");
    });
  });
});
