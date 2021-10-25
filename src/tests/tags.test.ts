import { getTag } from "../index";

describe("Fetches id data", () => {
  test("Fetches canonical tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: "56312676",
    });
  });

  test("Fetches non-canonical tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: "56312676",
    });
  });

  test("Returns null for non-common tag", async () => {
    const tag = await getTag({
      tagName: "Original Senator Characters",
    });
    expect(tag).toMatchObject({
      name: "Original Senator Characters",
      id: null,
    });
  });
});

describe("Fetches canonical data", () => {
  test("Fetches canonical tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      canonical: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  test("Fetches non-canonical tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      canonical: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  test("Returns null for non-common tag", async () => {
    const tag = await getTag({
      tagName: "Original Senator Characters",
    });
    expect(tag).toMatchObject({
      name: "Original Senator Characters",
      canonical: null,
    });
  });
});

describe("Fetches category data", () => {
  test("Fetches fandom tag", async () => {
    const tag = await getTag({ tagName: "The Lorax (2012)" });

    expect(tag).toMatchObject({
      name: "The Lorax (2012)",
      category: "fandom",
    });
  });

  test("Fetches character tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      category: "character",
    });
  });

  test("Fetches relationship tag (with /)", async () => {
    const tag = await getTag({ tagName: "Komaeda Nagito/Sans (Undertale)" });

    expect(tag).toMatchObject({
      name: "Komaeda Nagito/Sans (Undertale)",
      category: "relationship",
    });
  });

  test("Fetches relationship tag (with &)", async () => {
    const tag = await getTag({
      tagName: "Castiel (Supernatural) & Misha Collins",
    });

    expect(tag).toMatchObject({
      name: "Castiel (Supernatural) & Misha Collins",
      category: "relationship",
    });
  });

  test("Fetches archive warnings tag", async () => {
    const tag = await getTag({ tagName: "Choose Not To Use Archive Warnings" });

    expect(tag).toMatchObject({
      name: "Choose Not To Use Archive Warnings",
      category: "archive warning",
    });
  });

  test("Fetches additional tags tag", async () => {
    const tag = await getTag({ tagName: "a shit ton of angst" });

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      category: "additional tags",
    });
  });
});

describe("Fetches id data", () => {
  test("Fetches character tag (canonical)", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: "56312676",
    });
  });

  test("Fetches character tag (non-canonical)", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: "56312676",
    });
  });

  test("Fetches additional tags", async () => {
    const tag = await getTag({ tagName: "a shit ton of angst" });

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      id: null,
    });
  });
});

describe("Fetches common tag data", () => {
  test("Fetches uommon tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      common: true,
    });
  });

  test("Fetches uncommon tag", async () => {
    const tag = await getTag({ tagName: "Original Senator Characters" });

    expect(tag).toMatchObject({
      name: "Original Senator Characters",
      common: false,
    });
  });
});
