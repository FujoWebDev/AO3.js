import { getUser } from "src/index";
import type { User } from "types/entities";
import { describe, it, expect } from "vitest";
import { initSetup } from "./setup";
//NOTE: Some of these tests may fail if the referenced user has updated their profile!

initSetup();

describe("Fetches id data.", () => {
  it("Fetches username and user ID", async () => {
    const user = await getUser({
      username: "astolat",
    });

    expect(user).toMatchObject({
      username: "astolat",
      id: "8",
      url: "https://archiveofourown.org/users/astolat/profile",
      pseuds: "astolat, shalott, the lady of shalott",
      joined: "2008-09-13",
    } satisfies Partial<User>);
  });

  it("Fetches information about a user who filled in optional profile fields", async () => {
    const user = await getUser({
      username: "astolat",
    });

    expect(user.bioHtml).toMatchInlineSnapshot(
      `"<p>I <a href="https://astolat.dreamwidth.org/125056.html" rel="nofollow">built this city</a>.</p><p>I'm also: <a href="https://astolat.tumblr.com" rel="nofollow">astolat @ Tumblr</a>, <a href="https://twitter.com/intimations" rel="nofollow">@intimations on Twitter</a>, <a href="https://www.youtube.com/user/astolatvids" rel="nofollow">astolatvids on YouTube</a>.</p><p><strong>Blanket Permission Policy</strong><br>I love transformative works based on my work. As long as it's noncommercial and credit is given, you don't need to ask permission. More than one person is welcome to podfic/translate/sequel/illustrate/etc any given story. Please post your work here and cite my original story as a related work, so I can link back!</p><p>You can look at my <a href="https://archiveofourown.org/users/astolat/related_works" rel="nofollow">Related Works</a> listing to see existing translations, podfics, and other related works.</p><p><strong>Warnings</strong><br>My work is labeled Choose Not To Warn unless I am confident it is safe. Most of my work is not! I do add more specific warnings sometimes, but my judgement may not align with yours. I don't tag exhaustively for every story element that appears in my work.</p><p><strong>Collections</strong><br>If you want to add one of my stories to a collection, please bookmark it and add your bookmark to the collection instead. I don't approve collection requests anymore because of abuse, sorry. :/</p><p><strong>Personal</strong><br>I’m a pro writer IRL and my identity is a fairly open secret in fandom, but I prefer not crossing the streams. It’s fine to ask about and share it privately, but please don’t out me in public and googleable places. That includes comments and tumblr posts/comments! Thank you!</p><p><strong>Pronouns:</strong> she/her</p>"`
    );
  });

  it("Fetches information about a user who filled in optional profile fields", async () => {
    const user = await getUser({
      username: "franzeska",
    });

    expect(user).toMatchObject({
      username: "Franzeska",
      id: "87",
      location: "Oakland",
      birthday: "1981-02-13",
      icon: expect.stringMatching(
        /^https:\/\/archiveofourown\.org\/rails\/active_storage\/representations\/proxy\/[^/]+\/[^/]+\/original\.jpg$/
      ),
      header: "Yes, it's really spelled with a Z",
    } satisfies Partial<User>);
  });
});
