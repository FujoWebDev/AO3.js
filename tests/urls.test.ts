import { describe, it, expect } from "vitest";
import {
  getAuthorFromUrl,
  getSearchUrlFromTagFilters,
  getTagUrl,
  getTagWorksFeedUrl,
  getUserDetailsFromUrl,
  getUserWorksUrl,
} from "src/urls";

/**
 * Verify generated URL strings to catch case-sensitivity issues. The end-to-end mock
 * tests aren't sufficient by themselves because:
 *
 * 1. Some file systems (like MacOS') are case-insensitive, which means that
 *    paths like "Character" and "character" resolve to the same file.
 * 2. AO3's API requires specific casing for URL parameters (e.g., `type=Character`)
 * 3. Our end-to-end tests use file-based mocks, which can't reliably catch case-sensitivity
 *    bugs because of #1.
 *
 */
describe("getSearchUrlFromTagFilters", () => {
  describe("type parameter casing", () => {
    it("should title-case the type parameter for 'character'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should title-case the type parameter for 'fandom'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "fandom",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Fandom",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should title-case the type parameter for 'relationship'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "relationship",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Relationship",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should title-case the type parameter for 'freeform'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "freeform",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Freeform",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should title-case 'any' type", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "any",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });
  });

  describe("other parameters", () => {
    it("should include page parameter", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 3,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "3",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should include tagName when provided", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: "test tag",
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "test tag",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should include fandoms when provided", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: ["Hazbin Hotel (Cartoon)"],
          wranglingStatus: "any",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "Hazbin Hotel (Cartoon)",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should handle wranglingStatus 'canonical' correctly", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "canonical",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "canonical",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should convert 'canonical_or_synonymous' to 'canonical_synonymous'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "canonical_or_synonymous",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "canonical_synonymous",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should convert 'noncanonical_and_nonsynonymous' to 'noncanonical_nonsynonymous'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "noncanonical_and_nonsynonymous",
          sortColumn: "name",
          sortDirection: "asc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "noncanonical_nonsynonymous",
        "tag_search[sort_column]": "name",
        "tag_search[sort_direction]": "asc",
      });
    });

    it("should convert works_count sortColumn to 'uses'", () => {
      const url = new URL(
        getSearchUrlFromTagFilters({
          type: "character",
          tagName: null,
          fandoms: [],
          wranglingStatus: "any",
          sortColumn: "works_count",
          sortDirection: "desc",
          page: 1,
        }),
      );

      expect(Object.fromEntries(url.searchParams)).toEqual({
        page: "1",
        commit: "Search Tags",
        "tag_search[name]": "",
        "tag_search[fandoms]": "",
        "tag_search[type]": "Character",
        "tag_search[wrangling_status]": "any",
        "tag_search[sort_column]": "uses",
        "tag_search[sort_direction]": "desc",
      });
    });
  });
});

/**
 * Verify getTagUrl special character replacements.
 *
 * AO3 uses a custom encoding for certain characters in tag URLs that differs
 * from standard URL encoding. The redownload-articles.mts script handles these
 * same replacements when reconstructing URLs from file paths, so we test them
 * here to make sure we don't accidentally break them in the library.
 */
describe("getTagUrl", () => {
  describe("special character replacements", () => {
    it("should replace forward slash with *s*", () => {
      const url = new URL(getTagUrl("M/M"));

      expect(url.pathname).toBe("/tags/M*s*M/");
    });

    it("should replace ampersand with *a*", () => {
      const url = new URL(getTagUrl("Tom & Jerry"));

      expect(url.pathname).toBe("/tags/Tom%20*a*%20Jerry/");
    });

    it("should replace period with *d*", () => {
      const url = new URL(getTagUrl("Dr. Who"));

      expect(url.pathname).toBe("/tags/Dr*d*%20Who/");
    });

    it("should replace hash with *h*", () => {
      const url = new URL(getTagUrl("C#"));

      expect(url.pathname).toBe("/tags/C*h*/");
    });

    it("should replace question mark with *q*", () => {
      const url = new URL(getTagUrl("What If?"));

      expect(url.pathname).toBe("/tags/What%20If*q*/");
    });

    it("should handle multiple special characters", () => {
      const url = new URL(getTagUrl("A/B & C.D"));

      expect(url.pathname).toBe("/tags/A*s*B%20*a*%20C*d*D/");
    });

    it("should end with trailing slash", () => {
      const url = new URL(getTagUrl("Simple Tag"));

      expect(url.pathname).toBe("/tags/Simple%20Tag/");
    });
  });
});

describe("getTagWorksFeedUrl", () => {
  it("should append /works to tag URL", () => {
    const url = new URL(getTagWorksFeedUrl("M/M"));

    expect(url.pathname).toBe("/tags/M*s*M/works");
  });

  it("should handle special characters in tag name", () => {
    const url = new URL(getTagWorksFeedUrl("Tom & Jerry"));

    expect(url.pathname).toBe("/tags/Tom%20*a*%20Jerry/works");
  });
});

describe("getUserWorksUrl", () => {
  it("keeps reserved username and pseud characters within their path segments", () => {
    const url = new URL(getUserWorksUrl({
      username: "a/b?#&",
      pseud: "c/d?#&",
    }));

    expect(url.pathname).toBe("/users/a%2Fb%3F%23%26/pseuds/c%2Fd%3F%23%26/works");
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
  });

  it("should build the works URL for a user", () => {
    const url = new URL(getUserWorksUrl({ username: "astolat" }));

    expect(url.pathname).toBe("/users/astolat/works");
    expect(url.search).toBe("");
  });

  it("should build the works URL for a pseud of a user", () => {
    const url = new URL(
      getUserWorksUrl({ username: "astolat", pseud: "the lady of shalott" })
    );

    expect(url.pathname).toBe(
      "/users/astolat/pseuds/the%20lady%20of%20shalott/works"
    );
  });

  it("should include the page number", () => {
    const url = new URL(getUserWorksUrl({ username: "astolat", page: 2 }));

    expect(url.searchParams.get("page")).toBe("2");
  });

  it("should wrap sort parameters in work_search[]", () => {
    const url = new URL(
      getUserWorksUrl({
        username: "astolat",
        sortColumn: "kudos_count",
        sortDirection: "asc",
      })
    );

    expect(url.searchParams.get("work_search[sort_column]")).toBe(
      "kudos_count"
    );
    expect(url.searchParams.get("work_search[sort_direction]")).toBe("asc");
  });

  it.each([
    ["authors", "authors_to_sort_on"],
    ["title", "title_to_sort_on"],
    ["updated_at", "revised_at"],
    ["created_at", "created_at"],
  ] as const)("should send sort column %s as %s", (sortColumn, ao3Column) => {
    const url = new URL(getUserWorksUrl({ username: "astolat", sortColumn }));

    expect(url.searchParams.get("work_search[sort_column]")).toBe(ao3Column);
  });

  it("should omit sort parameters that are not provided", () => {
    const url = new URL(
      getUserWorksUrl({ username: "astolat", sortDirection: "desc" })
    );

    expect(url.searchParams.get("work_search[sort_direction]")).toBe("desc");
    expect(url.searchParams.has("work_search[sort_column]")).toBe(false);
  });

  it("should encode special characters in the username", () => {
    const url = new URL(getUserWorksUrl({ username: "a user" }));

    expect(url.pathname).toBe("/users/a%20user/works");
  });
});

describe("getAuthorFromUrl", () => {
  it("should read the username and pseud from a pseud URL", () => {
    expect(getAuthorFromUrl({ url: "/users/astolat/pseuds/astolat" })).toEqual({
      username: "astolat",
      pseud: "astolat",
      anonymous: false,
    });
  });

  it("should decode pseuds with special characters", () => {
    expect(
      getAuthorFromUrl({ url: "/users/franzeska/pseuds/Franzeska%20Ewart" }),
    ).toEqual({
      username: "franzeska",
      pseud: "Franzeska Ewart",
      anonymous: false,
    });
  });

  it("should throw for author URLs without a pseud", () => {
    expect(() => getAuthorFromUrl({ url: "/users/astolat" })).toThrow(
      "Unexpected author URL: /users/astolat",
    );
  });

  it("should throw for URLs that don't point to a user", () => {
    expect(() => getAuthorFromUrl({ url: "/works/12345" })).toThrow(
      "Invalid user URL: /works/12345",
    );
  });
});

describe("getUserDetailsFromUrl", () => {
  it.each([
    "/users/astolat",
    "/users/astolat/",
    "/users/astolat/profile",
    "/users/astolat/works",
    "/users/astolat/works?page=2",
    "https://archiveofourown.org/users/astolat",
    "https://archiveofourown.org/users/astolat/works?work_search%5Bsort_column%5D=hits",
  ])("should read only the username from %s", (url) => {
    expect(getUserDetailsFromUrl({ url })).toEqual({ username: "astolat" });
  });

  it.each([
    "/users/astolat/pseuds/astolat",
    "/users/astolat/pseuds/astolat/works",
    "https://archiveofourown.org/users/astolat/pseuds/astolat/works?page=2",
  ])("should read the username and pseud from %s", (url) => {
    expect(getUserDetailsFromUrl({ url })).toEqual({
      username: "astolat",
      pseud: "astolat",
    });
  });

  it("should round-trip the URLs we build for user works", () => {
    expect(
      getUserDetailsFromUrl({
        url: getUserWorksUrl({ username: "franzeska", pseud: "Franzeska Ewart" }),
      }),
    ).toEqual({ username: "franzeska", pseud: "Franzeska Ewart" });
  });

  it("should throw for URLs that don't point to a user", () => {
    expect(() => getUserDetailsFromUrl({ url: "/works/12345" })).toThrow(
      "Invalid user URL: /works/12345",
    );
  });
});
