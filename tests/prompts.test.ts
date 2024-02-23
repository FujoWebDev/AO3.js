import { getPromptDetailsFromUrl, getPromptUrl } from "src/urls";

describe("Fetches data from url", () => {
  test("Fetches prompt id from url", async () => {
    const promptData = await getPromptDetailsFromUrl({
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });
    expect(promptData).toMatchObject({
      promptId: "2644428",
    });
  });

  test("Fetches collection nameg from url", async () => {
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