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
      bioHtml: `<p>I'm also: <a href=\"http://astolat.dreamwidth.org\" rel=\"nofollow\">astolat @ Dreamwidth</a>, <a href=\"https://www.pillowfort.io/astolat\" rel=\"nofollow\">astolat@Pillowfort</a>, <a href=\"http://astolat.tumblr.com\" rel=\"nofollow\">astolat @ Tumblr</a>, <a href=\"http://twitter.com/intimations\" rel=\"nofollow\">@intimations on Twitter</a>, <a href=\"https://www.youtube.com/user/astolatvids\" rel=\"nofollow\">astolatvids on YouTube</a>. </p><p><strong>Blanket Permission Policy:</strong> </p><p>I love and welcome remixes/sequels/podfics/fanart/translations based on my work: as long as it's noncommercial and credit is given, you don't need to ask permission. More than one person is welcome to podfic/translate/sequel/etc any given story if they want to. </p><p>I WOULD especially love it if you post your work here and cite my original story as a related work, because then I can easily link back to you from the original story. </p><p>You can look at my <a href=\"https://archiveofourown.org/users/astolat/related_works\" rel=\"nofollow\">Related Works</a> listing to see existing translations, podfics, and other related works. </p><p>(One small note: sometimes the emails notifying me of a new related work go astray; if I don't approve a link back immediately, this has almost certainly happened! I do go through my Related Works page every few months or so and approve anything that slipped through the cracks.)</p><p>&nbsp;</p><p>  <strong>Warning Policy:</strong></p><p>&nbsp;</p><p>My work is generally labeled Choose Not To Warn unless I am really confident it is exceptionally safe. Most of my work is not! I do make an effort to add more specific warnings where I think appropriate and something is potentially triggering, but that's it. I don't tag exhaustively for every story element that appears in my work. Please do not leave me tag feedback (ie \"you should add a tag for X\"), as I just delete these comments. </p><p><strong>Pronouns:</strong> she/her, please</p>`
      
    });
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
    birthday: "1981-02-13"
   })
  })


});
