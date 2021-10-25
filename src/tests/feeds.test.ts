import { getTagNameById } from "..";

describe("Fetches tag name from tag id", () => {
  test("Fetches tag name from tag id", async () => {
    const tag = await getTagNameById({ tagId: "56312676" });

    expect(tag).toEqual("Ever Given Container Ship (Anthropomorphic)");
  });
});
