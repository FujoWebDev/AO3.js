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
        "Hands of a Murderer (1990)",
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
        "Sherlock Lupin e io - Alessandro Gatti",
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

    expect(tag.name).toBe("Mind Palace");
    expect(tag.subTags).toMatchInlineSnapshot(`
      [
        {
          "parentSubTag": null,
          "tagName": "Sherlock Holmes's Mind Palace",
        },
        {
          "parentSubTag": "Sherlock Holmes's Mind Palace",
          "tagName": "John Watson in Sherlock Holmes' Mind Palace",
        },
      ]
    `);
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
    expect(tag.subTags).toMatchInlineSnapshot(`
      [
        {
          "parentSubTag": null,
          "tagName": "Dixing Worldbuilding (Guardian)",
        },
        {
          "parentSubTag": null,
          "tagName": "Earth C Worldbuilding (Homestuck)",
        },
        {
          "parentSubTag": null,
          "tagName": "Geofiction",
        },
        {
          "parentSubTag": null,
          "tagName": "Halovian Lore and Worldbuilding (Honkai: Star Rail)",
        },
        {
          "parentSubTag": "Halovian Lore and Worldbuilding (Honkai: Star Rail)",
          "tagName": "Halovian Biology (Honkai: Star Rail)",
        },
        {
          "parentSubTag": null,
          "tagName": "Minecraft Worldbuilding",
        },
        {
          "parentSubTag": null,
          "tagName": "Naruto Worldbuilding",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Anbu Lore (Naruto)",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Kirigakure | Hidden Mist Village Worldbuilding",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Konohagakure | Hidden Leaf Village Worldbuilding",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Shinobi Culture (Naruto)",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Shinobi Politics (Naruto)",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Sunagakure | Hidden Sand Village Worldbuilding",
        },
        {
          "parentSubTag": "Naruto Worldbuilding",
          "tagName": "Uzushiogakure | Hidden Eddy Village Worldbuilding",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Aburame Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Hatake Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Hyuuga Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Nara Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Senju Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Uchiha Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Clan Lore (Naruto)",
          "tagName": "Uzumaki Clan Lore (Naruto)",
        },
        {
          "parentSubTag": "Hyuuga Clan Lore (Naruto)",
          "tagName": "Hyuuga Clan Politics (Naruto)",
        },
        {
          "parentSubTag": "Uchiha Clan Lore (Naruto)",
          "tagName": "Uchiha Clan Politics (Naruto)",
        },
        {
          "parentSubTag": "Shinobi Politics (Naruto)",
          "tagName": "Clan Politics (Naruto)",
        },
        {
          "parentSubTag": "Shinobi Politics (Naruto)",
          "tagName": "Konohagakure | Hidden Leaf Village Politics",
        },
        {
          "parentSubTag": "Clan Politics (Naruto)",
          "tagName": "Clan Restoration Act (Naruto)",
        },
        {
          "parentSubTag": "Clan Politics (Naruto)",
          "tagName": "Hyuuga Clan Politics (Naruto)",
        },
        {
          "parentSubTag": "Konohagakure | Hidden Leaf Village Politics",
          "tagName": "Uchiha Clan Politics (Naruto)",
        },
        {
          "parentSubTag": null,
          "tagName": "Vidyadhara Lore and Worldbuilding (Honkai: Star Rail)",
        },
        {
          "parentSubTag": "Vidyadhara Lore and Worldbuilding (Honkai: Star Rail)",
          "tagName": "Vidyadhara Biology (Honkai: Star Rail)",
        },
        {
          "parentSubTag": null,
          "tagName": "Xiang Fei | Shang Qinghua's Worldbuilding",
        },
        {
          "parentSubTag": null,
          "tagName": "Xianzhou Lore and Worldbuilding (Honkai: Star Rail)",
        },
        {
          "parentSubTag": "Xianzhou Lore and Worldbuilding (Honkai: Star Rail)",
          "tagName": "Luminary Wardance Ceremony (Honkai: Star Rail)",
        },
      ]
    `);
  });

  it("should fetch no subtags", async () => {
    const tag = await getTag({ tagName: "Eventual Romance" });

    expect(tag).toMatchObject({ name: "Eventual Romance", subTags: [] });
  });
});

describe("Tags/synonyms", () => {
  it("should fetch tags with same meaning for canonical tags", async () => {
    const tag = await getTag({ tagName: "Charlie Magne | Morningstar" });

    expect(tag.name).toBe("Charlie Magne | Morningstar");
    expect(tag.canonical).toBe(true);
    expect(tag.tagsWithSameMeaning).toMatchInlineSnapshot(`
      [
        "(Charlie just mentioned)",
        "(mentioned) Charlie Magne | Morningstar",
        "(mentions) Charlie Magne",
        "2p Charlie (Mentioned briefly)",
        "2P Charlie - Character",
        "2P Charlie Magne",
        "Anti-Charlie",
        "baby Charlie Magne - Character",
        "Baby Charlie Morningstar - Character",
        "Background Charlie - Character",
        "Background Charlie Magne | Morningstar",
        "Blessed Cat Charlie",
        "Brief Charlie Morningstar - Character",
        "cahrlie",
        "Charlie (briefly mentioned)",
        "Charlie (Hazbin Hotel)",
        "Charlie (Hazbin Hotel) (mentioned)",
        "Charlie (Hazbin Hotel) | mentioned",
        "Charlie (Hazbin Hotel)(background)",
        "Charlie (Hazbing Hotel)",
        "Charlie (Mentioned small cameo)",
        "Charlie - Mentioned",
        "Charlie Hazbin hotel",
        "Charlie Hellspawn",
        "charlie is here but not enough to tag really",
        "Charlie Killjoy",
        "Charlie Magne",
        "Charlie Magne (Deceased)",
        "Charlie Magne (Hazbin Hotel)",
        "Charlie Magne (Mention Only)",
        "Charlie Magne (mentioned)",
        "Charlie Magne (Referenced)",
        "Charlie Magne [mentioned]",
        "Charlie Magne Morningstar",
        "Charlie magne | morningstar ( mentioned )",
        "Charlie Magne | Morningstar (Briefly)",
        "Charlie Magne | Morningstar (Hazbin Hotel) (mentioned)",
        "Charlie Magne | Morningstar (Mention)",
        "Charlie Magne | Morningstar (mentioned)",
        "Charlie Magne | Morningstar (Minor)",
        "Charlie Magne | Morningstar (referenced)",
        "Charlie Magne | Morningstar - mentioned",
        "Charlie Magne | Morningstar mentioned",
        "Charlie Magne | Morningstar ×",
        "Charlie Magne | Morningstar(but only mentioned)",
        "Charlie Magne | Morningstar(mentioned)",
        "Charlie Magne-Morningstar",
        "Charlie Magnet",
        "Charlie Magne| Morningstar (Hazbin Hotel)",
        "Charlie Mange",
        "Charlie Mange | Morningstar",
        "Charlie Mange | Morningstar (Hazbin Hotel)",
        "Charlie mentioned (Hazbin Hotel)",
        "Charlie Mor",
        "Charlie Moringstar",
        "Charlie Morningstar",
        "Charlie morningstar (hasbin hotel)",
        "Charlie Morningstar (Hazbin Hotel)",
        "Charlie Morningstar (Hazbin Hotel) (mentioned)",
        "Charlie Morningstar (mentioned)",
        "Charlie Morningstar - Mentioned",
        "Charlie Morningstar implied",
        "Charlie Morningstar(Hazbin Hotel)",
        "Charlie Morningstar/Magne",
        "charlie's mentioned near the end",
        "Charlie's shadow",
        "charlie( hazbin hotel)",
        "Charlie(Hazbin Hotel)",
        "Charlotte "Charlie" Magne | Morningstar",
        "Charlotte "Charlie" Morningstar",
        "Charlotte Magne",
        "Charlotte Magne (Hazbin Hotel)",
        "Charlotte Morningstar",
        "Charlotte Morningstar (Hazbin Hotel)",
        "Charlotte vasiliou magne (hazbin hotel au)",
        "Charolette Magne (Hazbin Hotel)",
        "child Charlie - Character",
        "Cursed Cat Charlie",
        "Dark Charlie Magne | Morningstar - Character",
        "Dark!Queen Charlie",
        "Demeter Charlie",
        "Demon Charlie - Character",
        "Demon Charlie Magne - Character",
        "Demon Charlie Morningstar",
        "Demon!Charlie - Character",
        "Evil!Charlie - Character",
        "Human Charlie - Character",
        "Human Charlie Magne (Hazbin Hotel)",
        "human!Charlie - Character",
        "kid Charlie (Hazbin Hotel)",
        "Mention of Charlie Morningstar (Hazbin Hotel)",
        "mentioned Charlie",
        "Mentioned Charlie (Hazbin Hotel)",
        "mentioned Charlie Magne - Character",
        "Mentioned Charlie Magne Morningstar",
        "mentioned Charlie Magne | Morningstar - Character",
        "Mentioned Charlie mange",
        "Mentioned Charlie Morningstar",
        "Mentioned Charlie Morningstar (Hazbin hotel) - Character",
        "Mentions Charlie Magne | Morningstar",
        "mentions of Charlie Magne",
        "Mentions of Charlie Magne | Morningstar",
        "Mentions of Charlie Morningstar - Character",
        "Minor Charlie Magne | Morningstar - Character",
        "Princess Charlie (Hazbin Hotel)",
        "Princess Charlotte Morningstar - Character",
        "Referenced Charlie",
        "swap charlie",
        "The Savant | Charlie Morningstar",
      ]
    `);
  });

  it("should return empty array for tags with no synonyms", async () => {
    const tag = await getTag({ tagName: "Original Senator Characters" });

    expect(tag).toMatchObject({
      name: "Original Senator Characters",
      tagsWithSameMeaning: [],
    });
  });
});

