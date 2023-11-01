import { getSeries } from "src/index";

// TODO: Add more tests

describe("Fetches series information", () => {
  test("Fetches series object in its entirety", async () => {
    const series = await getSeries({ seriesId: "2270465" });

    expect(series).toMatchObject({
      id: "2270465",
      name: "OG Titan",
      begunAt: "2021-04-11",
      updatedAt: "2023-02-13",
      creators: [{ username: "MyHero", pseud: "MyHero" }],
      description:
        "<p>My potentially related stories about the relationship between the OG Titans. Probably focused on Dick Grayson.</p>",
      notes: null,
      words: 30044,
      bookmarks: 177,
      complete: false,
      workCount: 6,
      works: [
        {
          id: "30604247",
          title: "Away from all of Reality",
          updatedAt: "2021-04-11",
          summary:
            "<p>Donna Troy regularly dreams about kidnapping her Wonder Twin, Dick Grayson, and running away to a better life. She wants to put him in a safe little apartment in Paris, or drag him to London, or disappear into the wilderness, or move out to the Kent farm. She dreams of taking him away to New York, cutting all the toxic people from his life and helping him grow.</p><p>Donna dreams to give Dick a better life but knows in her soul that he would never go. She knows that Dick would never be able to walk away from the others because it goes against his very being. </p><p>Donna is terrified of the possible day where Dick honestly takes her up on the offer to run away. It terrifies her because deep in her heart, because she knows if he ever truly says yes, that means they have finally broken him. And for all her strength, Donna doesn't know if she would be able to put him back to together again.</p><p>But still she dreams, of them running away because it's those small moments that keeps her from burning the world as she follows him through this Hell.</p>",
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
          stats: { bookmarks: 177, kudos: 1, hits: 8 },
        },
        {
          id: "30794750",
          title: "Code B",
          updatedAt: "2023-02-01",
          summary:
            '<p>It started with a group text from Garth, between him, Wally, Roy, and Donna. </p><p>Tuesday 8:37pm<br>Fish-R-Us: Code Burgundy - D</p><p>&nbsp;<br>It ended with Roy starting to realize just how far he has wondered from his family due to misguided anger.<br>And maybe he starts to do something about it, the first step is to find out find the missing pieces. He along with Jason (who was first reluctant then determined) are on a mission for the truth to the "death" of Dick Grayson.</p>',
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
          stats: { bookmarks: 561, kudos: 2, hits: 51 },
        },
        {
          id: "30914645",
          title: "Donna Troy Loves You",
          updatedAt: "2021-04-26",
          summary:
            "<p>Three times Cassandra witnessed the friendship between Dick and Donna without Donna even being there. And the one time Donna was there in person.</p><p>Wonder Twins might not be in the same city, but they aren't any less wonderful.</p>",
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
          stats: { bookmarks: 192, kudos: 1, hits: 9 },
        },
        {
          id: "31221131",
          title: "Rockin Robin",
          updatedAt: "2021-05-11",
          summary:
            "<p>It started with a tweet. Actually it started with a Teen Titan case from back in the day that became a hobby and just a healthy outlit. &nbsp;It came back into their lives with a tweet.</p><p>&nbsp;</p><p>Inspired by Everyday one headcanon about Nightwing by TrikaLika (Chapter 38. Band)</p>",
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
          stats: { bookmarks: 70, kudos: 567, hits: 4 },
        },
        {
          id: "35757790",
          title: "Realistic Exit Strategy",
          updatedAt: "2023-02-13",
          summary:
            "<p>Dick knew about Donna's daydreams about him walking away. And maybe in his darkest moments, Dick has a few of his own. But now, as he and Donna board the plane to travel across the world, he wonders if he will ever make it back. This isn't how either of them expected it to go, but maybe that's the silver lining to the otherwise dark situation.</p><p>&nbsp;</p><p>Aka... It didn't take his death to finally make Dick walk away from Gotham, but he might not be able to say the same in a year.</p><p>The cure was still early stages of development, considered experimental at best. The Bats were the least of their concerns. Dick knows things will never be the same, assuming he lives at all.</p>",
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
          words: 5727,
          chapters: { published: 2, total: 3 },
          complete: false,
          stats: { bookmarks: 150, kudos: 993, hits: 8 },
        },
        {
          id: "44149795",
          title: "You starting down the road leaving me again",
          updatedAt: "2023-01-09",
          summary:
            "<p>Dick feels the distance between Bludhaven and Gotham like a crater in his chest. His family were light-years away, across the inkey Gotham Bay. The distant lights were sparkling stars in the smog.</p><p>He had hope. The Titans were his tethers, pulling him from the blackhole centered in his Bludhaven appartment.</p><p>Aka</p><p>Friends that sing together stay together</p>",
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
          stats: { bookmarks: 28, kudos: 242, hits: 1 },
        },
      ],
      workTitles: [
        "Away from all of Reality",
        "Code B",
        "Donna Troy Loves You",
        "Rockin Robin",
        "Realistic Exit Strategy",
        "You starting down the road leaving me again",
      ],
      workUrls: [
        "https://archiveofourown.org/works/30604247",
        "https://archiveofourown.org/works/30794750",
        "https://archiveofourown.org/works/30914645",
        "https://archiveofourown.org/works/31221131",
        "https://archiveofourown.org/works/35757790",
        "https://archiveofourown.org/works/44149795",
      ],
    });
  });

  test("Fetches author with username Anonymous", async () => {
    const series = await getSeries({ seriesId: "2946579" });
    expect(series.authors).toBe("Anonymous");
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
