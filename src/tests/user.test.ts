import { getUser } from "../index";

describe("Fetches id data", () => {
  test("Fetches username and user ID", async () => {
    const user = await getUser({
      userName: "astolat",
    });

    expect(user).toMatchObject({
      name: "astolat",
      id: "8",
      url: "https://archiveofourown.org/users/astolat/profile",
      pseuds: "astolat, shalott, the lady of shalott",
      joined: "2008-09-13",
    });

    expect(user.bioHtml).toMatchInlineSnapshot(`"<p>I <a href="https://astolat.dreamwidth.org/125056.html" rel="nofollow">built this city</a>.</p><p>I'm also: <a href="http://astolat.dreamwidth.org" rel="nofollow">astolat @ Dreamwidth</a>, <a href="http://astolat.tumblr.com" rel="nofollow">astolat @ Tumblr</a>, <a href="http://twitter.com/intimations" rel="nofollow">@intimations on Twitter</a>, <a href="https://www.youtube.com/user/astolatvids" rel="nofollow">astolatvids on YouTube</a>.</p><p><strong>Blanket Permission Policy:</strong> </p><p>I love remixes/sequels/podfics/fanart/translations based on my work. As long as it's noncommercial and credit is given, you don't need to ask permission. More than one person is welcome to podfic/translate/sequel/etc any given story. </p><p>Please post your work here and cite my original story as a related work, so I can link back! </p><p>You can look at my <a href="https://archiveofourown.org/users/astolat/related_works" rel="nofollow">Related Works</a> listing to see existing translations, podfics, and other related works. <br>&nbsp;</p><p><strong>Warning Policy:</strong><br>&nbsp;<br>My work is generally labeled Choose Not To Warn unless I am confident it is safe. Most of my work is not! I do add more specific warnings sometimes, but my judgement may not align with yours. I don't tag exhaustively for every story element that appears in my work. Please do not leave me tag feedback (ie "you should add a tag for X"). </p><p>&nbsp;</p><p>  <strong>Collections</strong></p><p>&nbsp;</p><p>If you want to add one of my stories to a collection, please bookmark it and add the bookmark yourself. I don't approve collection requests anymore because of abuse, sorry. :/</p><p><strong>Pronouns:</strong> she/her, please</p>"`);
  });
  test("Fetches information about a user who filled in optional profile fields", async () => {
    const user = await getUser({
      userName: "franzeska",
    });

    expect(user).toMatchObject({
      name: "Franzeska",
      id: "87",
      location: "Oakland",
      email: "fdickson@ix.netcom.com",
      birthday: "1981-02-13",
    });
  });
});
