import { getTag } from "src/index";

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
      tagName: "No Fandom - Freeform",
    });
    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      id: null,
    });
  });

  test("Fetches tag with .", async () => {
    const tag = await getTag({
      tagName: "Court Lady Go (Mr. Queen)",
    });

    expect(tag).toMatchObject({
      name: "Court Lady Go (Mr. Queen)",
      id: "55920663",
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
      canonical: true,
      canonicalName: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  test("Fetches non-canonical tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      canonical: false,
      canonicalName: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  test("Returns null for non-common tag", async () => {
    const tag = await getTag({
      tagName: "No Fandom - Freeform",
    });
    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      canonical: false,
      canonicalName: null,
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
  test("Fetches common tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      common: true,
    });
  });

  test("Fetches uncommon tag", async () => {
    const tag = await getTag({ tagName: "No Fandom - Freeform" });

    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      common: false,
    });
  });
});

describe("Fetches parent tags", () => {
  test("Fetches parent tag", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      parentTags: ["Water Vehicles (Anthropomorphic)"],
    });
  });

  test("Fetches no fandom tag", async () => {
    const tag = await getTag({ tagName: "No Fandom - Freeform" });

    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      parentTags: ["No Fandom"],
    });
  });

  test("Fetches multiple parent tags", async () => {
    const tag = await getTag({ tagName: "Sherlock Holmes" });

    expect(tag).toMatchObject({
      name: "Sherlock Holmes",
      parentTags: [
        "221B Baker Towers",
        "A Study in Emerald - Neil Gaiman",
        "A Study in Terror (1965)",
        "Elementary (TV)",
        "Enola Holmes (Movies)",
        "Enola Holmes Series - Nancy Springer",
        "Hark! A Vagrant",
        "Holmes & Watson (2018)",
        "Irene Adler Series - Carole Nelson Douglas",
        "Mary Russell - Laurie R. King",
        "Murder by Decree (1979)",
        "Mycroft Holmes Series - Kareem Abdul-Jabbar & Anna Waterhouse",
        "Sherlock & Co. (Podcast)",
        "Sherlock (TV)",
        "Sherlock Holmes (1984 TV)",
        "Sherlock Holmes (Downey films)",
        "Sherlock Holmes (Radio 1989-2010 Coules)",
        "Sherlock Holmes (TV 1965)",
        "Sherlock Holmes - Arthur Conan Doyle",
        "Sherlock Holmes Chapter One (Video Game)",
        "Sherlock Holmes in the 22nd Century (Cartoon)",
        "Sherlock Holmes: The Awakened (Video Game)",
        "Sherlock: Find Hidden Objects (Video Game)",
        "The Irregulars (TV)",
        "The Private Life of Sherlock Holmes (1970)",
        "There Is No Game: Wrong Dimension (Video Game)",
      ],
    });
  });

  test("Can fetch tags with multiple dots", async () => {
    const tag = await getTag({
      tagName: "A Song of Ice and Fire - George R. R. Martin",
    });

    expect(tag).toMatchObject({
      name: "A Song of Ice and Fire - George R. R. Martin",
    });
  });
});
