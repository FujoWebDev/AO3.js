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

     /*whether it actually is the updated date or the creation date is still up in the air. 
    altered an older prompt at about 5pm on 24/02/24 and it's still showing 23.
    may be slow to update. may be something else. */

    test("Fetches prompt updated date", async () => {
      const prompt = await getPrompt({
        promptId: "2644428",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        updatedAt: "23 May 2022",
        summary: `<p>A big round of applause for all our prompters and fillers for making the first round of the MDZS Kink Meme on AO3 such a rousing success! If you want to submit your own prompt, the most recent round of prompts (2022) can be found <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2022/requests" rel="nofollow">here</a>, and any past or future rounds can be found in the MDZS Kink Meme <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme" rel="nofollow">Parent Collection</a>.</p><p> KEEP CLAIMING &amp; FILLING THESE PROMPTS! Prompts from ANY round of the MDZS Kink Meme can be filled indefinitely. We will always accept more fills for old prompts!<br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/requests" rel="nofollow">2020 Prompts</a><br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_21Q1/requests" rel="nofollow">2021 Q1 Prompts</a><br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_21Q2/requests" rel="nofollow">2021 Q2 Prompts</a></p><p> Also, if you'd like to fill a <a href="https://pinboard.in/u:mdzs-kinkmeme/t:%252APROMPT_DELETED_but_can_still_be_filled_and_submitted_to_collection%2521%252A" rel="nofollow">deleted prompt</a> you found on the Pinboard, you can add it to the collection by claiming &amp; filling this prompt!</p>`
      });
    });


    test("Fetches null summary", async () => {
      const prompt = await getPrompt({
        promptId: "3566161",
        collectionName: "test_prompt_meme_2024"
      });

      expect(prompt).toMatchObject({
        summary: null,
      });
    });

    test("Fetches display title", async () => {
      const prompt = await getPrompt({
        promptId: "2644428",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        collectionDisplayTitle: "Mó Dào Zǔ Shī | The Untamed Kink Meme 2020",
      });
    });


    test("Fetches Ratings", async () => {
      const prompt = await getPrompt({
        promptId: "1927806",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        ratings: ["General Audiences", "Teen And Up Audiences", "Mature"],
      });
    });

    test("Fetches \"Not Rated\" for no specified ratings", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
        })
      );

      expect(prompt).toMatchObject({
        ratings: ["Not Rated"],
      });
    });
 
    });

