import { getTag } from "../index";

describe("Fetches canonical data", () => {
  test("Fetches canonical tag", async () => {
    const tag = await getTag("Ever Given Container Ship (Anthropomorphic)");

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      canonical: true,
    });
  });

  test("Fetches non-canonical tag", async () => {
    const tag = await getTag("Ever Given Container Ship - Anthropomorphic");

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: "56312676",
      canonical: false,
    });
  });
});

describe("Fetches category data", () => {
  test("Fetches fandom tag", async () => {
    const tag = await getTag("The Lorax (2012)");

    expect(tag).toMatchObject({
      name: "The Lorax (2012)",
      category: "fandom",
    });
  });

  test("Fetches character tag", async () => {
    const tag = await getTag("Ever Given Container Ship (Anthropomorphic)");

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      category: "character",
    });
  });

  test("Fetches relationship tag (with /)", async () => {
    const tag = await getTag("Komaeda Nagito/Sans (Undertale)");

    expect(tag).toMatchObject({
      name: "Komaeda Nagito/Sans (Undertale)",
      category: "relationship",
    });
  });

  test("Fetches relationship tag (with &)", async () => {
    const tag = await getTag("Castiel (Supernatural) & Misha Collins");

    expect(tag).toMatchObject({
      name: "Castiel (Supernatural) & Misha Collins",
      category: "relationship",
    });
  });

  test("Fetches archive warnings tag", async () => {
    const tag = await getTag("Choose Not To Use Archive Warnings");

    expect(tag).toMatchObject({
      name: "Choose Not To Use Archive Warnings",
      category: "archive warning",
    });
  });

  test("Fetches additional tags tag", async () => {
    const tag = await getTag("a shit ton of angst");

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      category: "additional tags",
    });
  });
});

describe("Fetches id data", () => {
  test("Fetches character tag (canonical)", async () => {
    const tag = await getTag("Ever Given Container Ship (Anthropomorphic)");

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: "56312676",
    });
  });

  test("Fetches character tag (non-canonical)", async () => {
    const tag = await getTag("Ever Given Container Ship - Anthropomorphic");

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: "56312676",
    });
  });

  test("Fetches additional tags", async () => {
    const tag = await getTag("a shit ton of angst");

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      id: null,
    });
  });
});

describe("Fetches common tag data", () => {
  test("Fetches additional tags", async () => {
    const tag = await getTag("Michael (Beyond the End)");

    expect(tag).toEqual({
      name: "a shit ton of angst",
      id: null,
    });
  });

  test("Fetches additional tags", async () => {
    const tag = await getTag("Graham Gregson");

    expect(tag).toEqual({
      name: "a shit ton of angst",
      id: null,
    });
  });
});
