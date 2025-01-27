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
        "Sherlock Holmes & Related Fandoms",
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
        "憂国のモリアーティ | Yuukoku no Moriarty | Moriarty the Patriot (Manga)",
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

describe("Fetch subtags", () => {
  test("Fetches subtags and sub-subtags", async () => {
    const tag = await getTag({ tagName: "Dysphoria" });

    expect(tag).toMatchObject({
      name: "Dysphoria",
      subTags: [
        { tagName: "Body Dysphoria", parentSubTag: null },
        {
          tagName: "Nott | Veth Brenatto Has Body Dysphoria",
          parentSubTag: "Body Dysphoria",
        },
        { tagName: "Gender Dysphoria", parentSubTag: null },
      ],
    });
  });

  test("Fetches nested sub-subtags", async () => {
    const tag = await getTag({ tagName: "Worldbuilding" });

    expect(tag).toMatchObject({
      name: "Worldbuilding",
      subTags: [
        { tagName: "Geofiction", parentSubTag: null },
        { tagName: "Naruto Worldbuilding", parentSubTag: null },
        {
          tagName: "Shinobi Politics (Naruto)",
          parentSubTag: "Naruto Worldbuilding",
        },
        {
          tagName: "Shinobi Culture (Naruto)",
          parentSubTag: "Naruto Worldbuilding",
        },
        {
          tagName: "Kirigakure | Hidden Mist Village Worldbuilding",
          parentSubTag: "Naruto Worldbuilding",
        },
        {
          tagName: "Konohagakure | Hidden Leaf Village Worldbuilding",
          parentSubTag: "Naruto Worldbuilding",
        },
        {
          tagName: "Uzushiogakure | Hidden Eddy Village Worldbuilding",
          parentSubTag: "Naruto Worldbuilding",
        },
        {
          tagName: "Sunagakure | Hidden Sand Village Worldbuilding",
          parentSubTag: "Naruto Worldbuilding",
        },
        { tagName: "Anbu Lore (Naruto)", parentSubTag: "Naruto Worldbuilding" },
        { tagName: "Clan Lore (Naruto)", parentSubTag: "Naruto Worldbuilding" },
        {
          tagName: "Clan Politics (Naruto)",
          parentSubTag: "Shinobi Politics (Naruto)",
        },
        {
          tagName: "Konohagakure | Hidden Leaf Village Politics",
          parentSubTag: "Shinobi Politics (Naruto)",
        },
        {
          tagName: "Clan Restoration Act (Naruto)",
          parentSubTag: "Clan Politics (Naruto)",
        },
        {
          tagName: "Hyuuga Clan Politics (Naruto)",
          parentSubTag: "Clan Politics (Naruto)",
        },
        {
          tagName: "Uchiha Clan Politics (Naruto)",
          parentSubTag: "Konohagakure | Hidden Leaf Village Politics",
        },
        {
          tagName: "Senju Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Aburame Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Nara Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Hatake Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Uzumaki Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Uchiha Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Hyuuga Clan Lore (Naruto)",
          parentSubTag: "Clan Lore (Naruto)",
        },
        {
          tagName: "Uchiha Clan Politics (Naruto)",
          parentSubTag: "Uchiha Clan Lore (Naruto)",
        },
        {
          tagName: "Hyuuga Clan Politics (Naruto)",
          parentSubTag: "Hyuuga Clan Lore (Naruto)",
        },
        { tagName: "Minecraft Worldbuilding", parentSubTag: null },
        { tagName: "Earth C Worldbuilding (Homestuck)", parentSubTag: null },
        { tagName: "Dixing Worldbuilding (Guardian)", parentSubTag: null },
        {
          tagName: "Vidyadhara Lore and Worldbuilding (Honkai: Star Rail)",
          parentSubTag: null,
        },
        {
          tagName: "Vidyadhara Biology (Honkai: Star Rail)",
          parentSubTag: "Vidyadhara Lore and Worldbuilding (Honkai: Star Rail)",
        },
        {
          tagName:
            "Shang Qinghua | Airplane Shooting Toward the Sky's Worldbuilding",
          parentSubTag: null,
        },
        {
          tagName: "Xianzhou Lore and Worldbuilding (Honkai: Star Rail)",
          parentSubTag: null,
        },
        {
          tagName: "Luminary Wardance Ceremony (Honkai: Star Rail)",
          parentSubTag: "Xianzhou Lore and Worldbuilding (Honkai: Star Rail)",
        },
      ],
    });
  });

  test("Fetches subtags", async () => {
    const tag = await getTag({ tagName: "Mind Palace" });

    expect(tag).toMatchObject({
      name: "Mind Palace",
      subTags: [
        { tagName: "Mind Palace John Watson", parentSubTag: null },
        { tagName: "Sherlock Holmes's Mind Palace", parentSubTag: null },
      ],
    });
  });

  test("Returns no subtags", async () => {
    const tag = await getTag({ tagName: "Eventual Romance" });

    expect(tag).toMatchObject({ name: "Eventual Romance", subTags: [] });
  });
});
