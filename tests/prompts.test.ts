import { getPromptDetailsFromUrl, getPromptUrl } from "src/urls";

import { getPrompt } from "src/index";

describe("Fetches data from url", () => {
  test("Fetches prompt id from url", async () => {
    const promptData = await getPromptDetailsFromUrl({
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });
    expect(promptData).toMatchObject({
      promptId: "2644428",
    });
  });

  test("Fetches collection name from url", async () => {
    const workData = await getPromptDetailsFromUrl({
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });

    expect(workData).toMatchObject({
      promptId: "2644428",
      collectionName: "mo_dao_zu_shi_kink_meme_2020",
    });
  });
});

describe("Gets url from data", () => {

  test("Gets url with collection name and prompt id", async () => {
    const workUrl = await getPromptUrl({
      promptId: "2644428",
      collectionName: "mo_dao_zu_shi_kink_meme_2020",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428"
    );
  });

});


  describe("Fetches prompt information", () => {
    console.log("Describe??")
    test("Fetches prompt updated date", async () => {
      console.log("test???")
      //getWork > getPrompt
      //work > prompt
      //calls the prompt ard recieves object below:
      const prompt = await getPrompt({
        promptId: "2644428",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });
  
      //work > prompt
      expect(prompt).toMatchObject({
        //changed id to example prompt id
        //added collectionName
        updatedAt: "23 May 2022"
      });
    })
/*
        authors: [{ username: "KBstories", pseud: "KBstories" }],
        title: "waiting//wishing",
        words: 36352,
        language: "English",
        rating: "Mature",
        category: ["Gen", "F/M"],
        fandoms: [
          "僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia",
        ],
        tags: {
          warnings: ["Graphic Depictions Of Violence"],
          characters: [
            "Kaminari Denki",
            "Bakugou Katsuki",
            "Kirishima Eijirou",
            "Jirou Kyouka",
            "Sero Hanta",
            "Ashido Mina",
            "Yamada Hizashi | Present Mic",
            "Class 1-A (My Hero Academia)",
          ],
          relationships: [
            "Bakugou Katsuki/Kirishima Eijirou",
            "Jirou Kyouka/Kaminari Denki",
            "Bakugou Katsuki & Kaminari Denki",
            "Ashido Mina & Bakugou Katsuki & Jirou Kyouka & Kaminari Denki & Kirishima Eijirou & Sero Hanta",
          ],
          additional: [
            "Post-Paranormal Liberation War Arc (My Hero Academia)",
            "Developing Friendships",
            "Character Study",
            "Injury Recovery",
            "Protective Bakusquad (My Hero Academia)",
            "Queerplatonic Relationships",
            "POV Kaminari Denki",
            "the romance is There but it's not the point (the point is found family)",
            "Medical Inaccuracies",
            "Some Fluff",
            "Asexual Bakugou Katsuki",
            "Post-Traumatic Stress Disorder - PTSD",
            "@ U.A. give these kids proper therapy or die by my sword",
            "Hurt/Comfort",
            "Angst with a Happy Ending",
            "Bakusquad-centric (My Hero Academia)",
            "Hospitals",
            "Anxiety",
            "POV Bakugou Katsuki",
            "(epilogue only)",
            "Canon compliant up to CH306",
            "Hurt Bakugou Katsuki",
          ],
        },
        publishedAt: "2021-01-28",
        updatedAt: "2021-03-03",
        chapters: {
          published: 7,
          total: 7,
        },
        summary:
          "<p>“<i>Bakugou will know what to do</i>. Top of the class, always quick on his feet and possessing the strongest nerves in all of 1-A – all of U.A., possibly. They’re at their most invincible with Bakugou there to hone their focus, to push them forward with that unique kind of teeth-bared tenacity Kaminari has come to rely on in the past year. When Kaminari looks, he sees–</p><p>Iida, helmet off, severe face twisted with agitation as he argues with the medics on the scene. Blood, so much blood, staining the gleaming chrome of his armor up to his neck in wet, intersecting streaks of crimson.</p><p>And in his arms, mask torn and body limp, is Bakugou Katsuki.”</p><p>In which disaster strikes, the Bakusquad comes together as a family once more, and Kaminari Denki is the MVP all the way through.</p>",
        stats: {
          bookmarks: 173,
          comments: 110,
          hits: 10903,
          kudos: 664,
        },
      });
      */
    });

