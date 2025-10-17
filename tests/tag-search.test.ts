import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getTagNameById, searchTags } from "src/index";

describe("Tags/search", () => {
  it("should fetch canonical characters for first page with no param", async () => {
    const result = await searchTags({
      type: "character",
      wranglingStatus: "canonical",
      fandoms: ["Hazbin Hotel (Cartoon)"],
    });

    expect(result.filters).toEqual({
      sortColumn: "name",
      sortDirection: "asc",
      tagName: null,
      type: "character",
      wranglingStatus: "canonical",
      page: 1,
      fandoms: ["Hazbin Hotel (Cartoon)"],
    });

    expect(result.pages).toEqual({ total: 3, current: 1 });

    // We just look at the names to make the snapshot more readable, and
    // because this fandom gets a lot of new works
    expect(result.tags.map((tag) => tag.name)).toMatchInlineSnapshot(`
      [
        "Abel (Hazbin Hotel)",
        "Adam (Hazbin Hotel)",
        "Alastor (Hazbin Hotel)",
        "Alastor's Father (Hazbin Hotel)",
        "Alastor's Grandmother (Hazbin Hotel)",
        "Alastor's Microphone (Hazbin Hotel)",
        "Alastor's Mother (Hazbin Hotel)",
        "Alastor's Shadow (Hazbin Hotel)",
        "Alastor's Sibling (Hazbin Hotel)",
        "Angel Dust (Hazbin Hotel)",
        "Angel Dust's Father (Hazbin Hotel)",
        "Angel Dust's Mother (Hazbin Hotel)",
        "Angel Dust's Shadow (Hazbin Hotel)",
        "Angels (Hazbin Hotel)",
        "Arackniss (Hazbin Hotel)",
        "Baxter (Hazbin Hotel)",
        "Belphegor (Helluva Boss)",
        "Bethesda Von Eldritch",
        "Bryrin (Hazbin Hotel)",
        "Cannibal Child Vaggie Spares in Flashback (Hazbin Hotel)",
        "Cannibal Town Ensemble (Hazbin Hotel)",
        "Carmilla Carmine (Hazbin Hotel)",
        "Carmilla Carmine's Daughters (Hazbin Hotel)",
        "Charlie Magne | Morningstar",
        "Cherri Bomb (Hazbin Hotel)",
        "Clara (Hazbin Hotel)",
        "Crymini (Hazbin Hotel)",
        "Dazzle (Hazbin Hotel)",
        "Dia (Hazbin Hotel)",
        "Egg Boi #11 (Hazbin Hotel)",
        "Egg Boi #23 (Hazbin Hotel)",
        "Emily (Hazbin Hotel)",
        "Essie (Hazbin Hotel)",
        "Eve (Hazbin Hotel)",
        "Ewe Demon (Hazbin Hotel)",
        "Exorcist Angels (Hazbin Hotel)",
        "Fat Nuggets (Hazbin Hotel)",
        "Frank (Hazbin Hotel)",
        "Franklin (Hazbin Hotel)",
        "Frederick Von Eldritch",
        "God (Hazbin Hotel)",
        "Happy Hotel | Hazbin Hotel Residents",
        "Harold Von Eldrich",
        "Hazbin Hotel Ensemble",
        "Helsa Von Eldritch",
        "Henroin (Hazbin Hotel)",
        "Husk (Hazbin Hotel)",
        "Husk's Father (Hazbin Hotel)",
        "Husk's Mother (Hazbin Hotel)",
        "Izzi (Hazbin Hotel)",
      ]
    `);
  });

  it("Should fetch canonical characters for a middle page", async () => {
    const result = await searchTags({
      type: "character",
      wranglingStatus: "canonical",
      fandoms: ["Hazbin Hotel (Cartoon)"],
      page: 2,
    });

    expect(result.filters).toEqual({
      sortColumn: "name",
      sortDirection: "asc",
      tagName: null,
      type: "character",
      wranglingStatus: "canonical",
      page: 2,
      fandoms: ["Hazbin Hotel (Cartoon)"],
    });

    expect(result.pages).toEqual({ total: 3, current: 2 });

    // We just look at the names to make the snapshot more readable, and
    // because this fandom gets a lot of new works
    expect(result.tags.map((tag) => tag.name)).toMatchInlineSnapshot(`
      [
        "Katie Killjoy",
        "KeeKee (Hazbin Hotel)",
        "Kitty (Hazbin Hotel)",
        "Leviathan (Helluva Boss)",
        "Lilith Magne | Morningstar",
        "Loan Shark Demon (Hazbin Hotel)",
        "Lucifer Magne | Morningstar",
        "Lucifer Magne | Morningstar's Siblings",
        "Lute (Hazbin Hotel)",
        "Melissa (Hazbin Hotel)",
        "Mimzy (Hazbin Hotel)",
        "Missi Zilla",
        "Molly (Hazbin Hotel)",
        "Monty Python (Hazbin Hotel)",
        "Niffty (Hazbin Hotel)",
        "Odette (Hazbin Hotel)",
        "Original Children of Alastor and Angel Dust (Hazbin Hotel)",
        "Original Children of Alastor and Lucifer Magne | Morningstar",
        "Original Hazbin Hotel Character(s)",
        "Original Magne | Morningstar Character(s)",
        "Overlords (Hazbin Hotel)",
        "Razzle (Hazbin Hotel)",
        "Roo (Hazbin Hotel)",
        "Rosie (Hazbin Hotel)",
        "Rosie's First Husband (Hazbin Hotel)",
        "Satan (Helluva Boss)",
        "Sera (Hazbin Hotel)",
        "Seviathan Von Eldritch",
        "Sir Pentious (Hazbin Hotel)",
        "Sir Pentious's Hat (Hazbin Hotel)",
        "St. Peter (Hazbin Hotel)",
        "Summer (Hazbin Hotel)",
        "Susan (Hazbin Hotel)",
        "The Egg Bois (Hazbin Hotel)",
        "The Seven Deadly Sins (Hazbin Hotel & Helluva Boss)",
        "The Three V's (Hazbin Hotel)",
        "Tiffany Titfucker (Hazbin Hotel)",
        "Tom Trench",
        "Travis (Hazbin Hotel)",
        "Vaggie (Hazbin Hotel)",
        "Vaggie's Father (Hazbin Hotel)",
        "Vaggie's Mother (Hazbin Hotel)",
        "Valentino (Hazbin Hotel)",
        "Vark | Vox's Shark (Hazbin Hotel)",
        "Vax (Hazbin Hotel)",
        "Velvette (Hazbin Hotel)",
        "Victor (Daisies - Black Gryph0n & Baasik)",
        "Vinny Shortcake (Hazbin Hotel)",
        "Vox (Hazbin Hotel)",
        "Vox's Assistant (Hazbin Hotel)",
      ]
    `);
  });

  it("should fetch canonical characters for last page", async () => {
    const result = await searchTags({
      type: "character",
      wranglingStatus: "canonical",
      fandoms: ["Hazbin Hotel (Cartoon)"],
      page: 3,
    });

    expect(result.filters).toEqual({
      sortColumn: "name",
      sortDirection: "asc",
      tagName: null,
      type: "character",
      wranglingStatus: "canonical",
      page: 3,
      fandoms: ["Hazbin Hotel (Cartoon)"],
    });

    expect(result.pages).toEqual({ total: 3, current: 3 });

    // We just look at the names to make the snapshot more readable, and
    // because this fandom gets a lot of new works
    expect(result.tags.map((tag) => tag.name)).toMatchInlineSnapshot(`
      [
        "Zeezi (Hazbin Hotel)",
        "Zestial (Hazbin Hotel)",
      ]
    `);
  });

  it("should return empty results when the search has no matches", async () => {
    const result = await searchTags({
      tagName: "asdfasdfasdfasdfasdfasdf",
      sortColumn: "name",
      sortDirection: "asc",
      type: "fandom",
      wranglingStatus: "canonical",
    });

    expect(result.filters).toEqual({
      sortColumn: "name",
      sortDirection: "asc",
      tagName: "asdfasdfasdfasdfasdfasdf",
      type: "fandom",
      wranglingStatus: "canonical",
      page: 1,
      fandoms: [],
    });

    expect(result.totalResults).toBe(0);
    expect(result.pages).toEqual({ total: 0, current: 1 });
    expect(result.tags).toEqual([]);
  });

  it("should return different results for different tag types", async () => {
    const result = await searchTags({
      // Chosen because somehow it has a bunch of diverse results.
      tagName: "an unusual",
      page: 2,
    });
    expect(result.filters).toEqual({
      tagName: "an unusual",
      fandoms: [],
      type: "any",
      wranglingStatus: "any",
      sortColumn: "name",
      sortDirection: "asc",
      page: 2,
    });

    expect(result.totalResults).toBe(199);

    // Some tags we should find to make sure the parser is working correctly.
    const UNSORTED_TAG = "an unusual ship that actually works very well! :)";
    const FREEFORM_TAG = "Eames projects his lust in an unusual way";
    const CHARACTER_TAG = "An Unusual Stained Glass Window";
    const CANONICAL_TAG =
      "Episode: s02e23 Facing an Unusual Past (Saiki Kusuo no Sai-nan)";

    expect(result.tags.find((tag) => tag.name === UNSORTED_TAG)).toEqual({
      name: UNSORTED_TAG,
      type: "unsorted",
      canonical: false,
      worksCount: 1,
    });
    expect(result.tags.find((tag) => tag.name === FREEFORM_TAG)).toEqual({
      name: FREEFORM_TAG,
      type: "freeform",
      canonical: false,
      worksCount: 1,
    });
    expect(result.tags.find((tag) => tag.name === CHARACTER_TAG)).toEqual({
      name: CHARACTER_TAG,
      type: "character",
      canonical: false,
      worksCount: 0,
    });
    expect(result.tags.find((tag) => tag.name === CANONICAL_TAG)).toEqual({
      name: CANONICAL_TAG,
      type: "freeform",
      canonical: true,
      worksCount: 0,
    });
  });
});
