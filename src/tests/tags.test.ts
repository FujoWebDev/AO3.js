import { getTag } from "../index";
describe("Fetches correct tag data", () => {
  test("Fetches canonical tag", async () => {
    const tag = await getTag("Ever Given Container Ship (Anthropomorphic)");

    expect(tag).toEqual({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: "56312676",
      canonical: true,
    });
  });
  test("Fetches non-canonical tag", async () => {
    const tag = await getTag("Ever Given Container Ship - Anthropomorphic");

    expect(tag).toEqual({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: "56312676",
      canonical: false,
    });
  });
});
