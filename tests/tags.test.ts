import { getTag } from "src/index";
import { describe, it, expect } from "vitest";

describe("Tags/data", () => {
  it("should fetch id data for canonical tags", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: 56312676,
    });
  });

  it("should fetch id data for non-canonical tags", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: 56312676,
    });
  });

  it("should use null for non-common tags", async () => {
    const tag = await getTag({
      tagName: "No Fandom - Freeform",
    });
    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      id: null,
    });
  });

  it("should fetch id data for tags with .", async () => {
    const tag = await getTag({
      tagName: "Court Lady Go (Mr. Queen)",
    });

    expect(tag).toMatchObject({
      name: "Court Lady Go (Mr. Queen)",
      id: 55920663,
    });
  });

  it("should fetch tags with multiple dots", async () => {
    const tag = await getTag({
      tagName: "A Song of Ice and Fire - George R. R. Martin",
    });

    expect(tag).toMatchObject({
      name: "A Song of Ice and Fire - George R. R. Martin",
    });
  });
});

describe("Tags/canonical", () => {
  it("should fetch canonical data for canonical tags", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      canonical: true,
      canonicalName: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  it("should fetch canonical data for non-canonical tags", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      canonical: false,
      canonicalName: "Ever Given Container Ship (Anthropomorphic)",
    });
  });

  it("should fetch use null for non-common tags", async () => {
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

describe("Tags/category", () => {
  it("should fetch category tag data for fandoms", async () => {
    const tag = await getTag({ tagName: "The Lorax (2012)" });

    expect(tag).toMatchObject({
      name: "The Lorax (2012)",
      category: "fandom",
    });
  });

  it("should fetch category tag data for characters", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      category: "character",
    });
  });

  it("should fetch category tag data for slash relationships", async () => {
    const tag = await getTag({ tagName: "Komaeda Nagito/Sans (Undertale)" });

    expect(tag).toMatchObject({
      name: "Komaeda Nagito/Sans (Undertale)",
      category: "relationship",
    });
  });

  it("should fetch category tag data for ampersand relationships", async () => {
    const tag = await getTag({
      tagName: "Castiel (Supernatural) & Misha Collins",
    });

    expect(tag).toMatchObject({
      name: "Castiel (Supernatural) & Misha Collins",
      category: "relationship",
    });
  });

  it("should fetch category tag data for archive warnings", async () => {
    const tag = await getTag({ tagName: "Choose Not To Use Archive Warnings" });

    expect(tag).toMatchObject({
      name: "Choose Not To Use Archive Warnings",
      category: "archive warning",
    });
  });

  it("should fetch category tag data for additional tags", async () => {
    const tag = await getTag({ tagName: "a shit ton of angst" });

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      category: "additional tags",
    });
  });
});

describe("Tags/id", () => {
  it("should fetch id data for character (canonical)", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship (Anthropomorphic)",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship (Anthropomorphic)",
      id: 56312676,
    });
  });

  it("should fetch id data for character (non-canonical)", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      id: 56312676,
    });
  });

  it("should use null for additional tags", async () => {
    const tag = await getTag({ tagName: "a shit ton of angst" });

    expect(tag).toMatchObject({
      name: "a shit ton of angst",
      id: null,
    });
  });
});

describe("Tags/common", () => {
  it("should fetch common tag data", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      common: true,
    });
  });

  it("should fetch uncommon tag data", async () => {
    const tag = await getTag({ tagName: "No Fandom - Freeform" });

    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      common: false,
    });
  });
});

describe("Tags/parent", () => {
  it("should fetch parent tags", async () => {
    const tag = await getTag({
      tagName: "Ever Given Container Ship - Anthropomorphic",
    });

    expect(tag).toMatchObject({
      name: "Ever Given Container Ship - Anthropomorphic",
      parentTags: ["Water Vehicles (Anthropomorphic)"],
    });
  });

  it("should fetch no fandom tags", async () => {
    const tag = await getTag({ tagName: "No Fandom - Freeform" });

    expect(tag).toMatchObject({
      name: "No Fandom - Freeform",
      parentTags: ["No Fandom"],
    });
  });

  it("should fetch multiple parent tags", async () => {
    const tag = await getTag({ tagName: "Sherlock Holmes" });

    expect(tag.name).toBe("Sherlock Holmes");
    expect(tag.parentTags).toMatchInlineSnapshot(`
      [
        "221B Baker Towers",
        "A Sherlock Holmes Adventure Series - Bonnie MacBird",
        "A Study in Emerald - Neil Gaiman",
        "A Study in Terror (1965)",
        "Baskerville: A Sherlock Holmes Mystery - Ludwig",
        "Dr. Jekyll and Mr. Holmes - Loren D. Estleman",
        "Dr. Watson Thrillers - Robert Ryan",
        "Dust and Shadow - Lyndsay Faye",
        "Elementary (TV)",
        "Enola Holmes (Movies)",
        "Enola Holmes Series - Nancy Springer",
        "Exit Sherlock Holmes - Robert Lee Hall",
        "Hark! A Vagrant",
        "Holmes & Watson (2018)",
        "Holmes Has Dementia | Series 4 Finale - That Mitchell & Webb Look Sketch",
        "Holmes: Science of Seduction (Visual Novel)",
        "Hound of the Baskervilles - Canny & Nicholson",
        "Irene Adler Series - Carole Nelson Douglas",
        "Mary Russell - Laurie R. King",
        "Murder by Decree (1979)",
        "Mycroft Holmes Series - Kareem Abdul-Jabbar & Anna Waterhouse",
        "Sherlock & Co. (Podcast)",
        "Sherlock & Daughter (TV)",
        "Sherlock (BBC TV 2010)",
        "Sherlock Holmes & Related Fandoms",
        "Sherlock Holmes (Downey Movies)",
        "Sherlock Holmes (Granada TV 1984)",
        "Sherlock Holmes (Radio 1989-2010 Coules)",
        "Sherlock Holmes (TV 1965)",
        "Sherlock Holmes - Arthur Conan Doyle",
        "Sherlock Holmes Chapter One (Video Game)",
        "Sherlock Holmes in the 22nd Century (Cartoon)",
        "Sherlock Holmes: Die geheimen Fälle des Meisterdetektivs (Radio)",
        "Sherlock Holmes: The Awakened (Video Game)",
        "Sherlock Holmes: The Game is Afoot! - Takarazuka Revue",
        "Sherlock: Find Hidden Objects (Video Game)",
        "The Irregulars (TV)",
        "The Private Life of Sherlock Holmes (1970)",
        "There Is No Game: Wrong Dimension (Video Game)",
        "Watson (TV 2025)",
        "Шерлок Холмс | Sherlock Holmes (TV 2013)",
        "名探偵ホームズ | Sherlock Hound",
      ]
    `);
  });
});

describe("Tags/sub", () => {
  it("should fetch subtags", async () => {
    const tag = await getTag({ tagName: "Mind Palace" });

    expect(tag).toMatchObject({
      name: "Mind Palace",
      subTags: [
        { tagName: "Mind Palace John Watson", parentSubTag: null },
        { tagName: "Sherlock Holmes's Mind Palace", parentSubTag: null },
      ],
    });
  });

  it("should fetch subtags and sub-subtags", async () => {
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
        {
          "parentSubTag": "Gender Dysphoria",
          "tagName": "TommyInnit Has Gender Dysphoria (Video Blogging RPF)",
        }
      ],
    });
  });

  it("should fetch nested sub-subtags", async () => {
    const tag = await getTag({ tagName: "Worldbuilding" });

    expect(tag.name).toBe("Worldbuilding");

    expect(tag.subTags).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });

  it("should fetch no subtags", async () => {
    const tag = await getTag({ tagName: "Eventual Romance" });

    expect(tag).toMatchObject({ name: "Eventual Romance", subTags: [] });
  });
});
