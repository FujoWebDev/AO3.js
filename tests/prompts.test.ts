import { getPromptDetailsFromUrl } from "src/urls";

describe("Fetches data from url", () => {
  test("Fetches prompt id from url", async () => {
    const promptData = await getPromptDetailsFromUrl({
      // getWorkDetailsFromUrl > getPromptDetailsFrom Url
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });
    //wordId > promptId
    expect(promptData).toMatchObject({
      promptId: "2644428",
    });
  });
});

// Ensure that it says the right things first: