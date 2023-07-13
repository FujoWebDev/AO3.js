import { getTagNameById } from "../src";

describe("Fetches tag name from tag id", () => {
  test("Fetches tag name from tag id (canonical)", async () => {
    const tag = await getTagNameById({ tagId: "56312676" });

    expect(tag).toEqual("Ever Given Container Ship (Anthropomorphic)");
  });

  test("Fetches tag name from non-existing id", async () => {
    const tag = await getTagNameById({ tagId: "56312666" });

    expect(tag).toBeNull();
  });
});
