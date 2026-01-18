import { TagSearchPage } from "src/page-loaders";
import { TagSearchResultSummary } from "types/entities";

const parseIntOrThrow = (text: string) => {
  const match = text.trim().match(/^(\d+)/);
  if (!match) {
    throw new Error(`Invalid integer: ${text}`);
  }
  return parseInt(match[1].trim(), 10);
};

export const getTotalResults = (page: TagSearchPage) => {
  const totalResultsMatch = page("h3.heading")
    .first()
    .text()
    .match(/(\d+)\s+Found/);
  return totalResultsMatch ? parseIntOrThrow(totalResultsMatch[1]) : 0;
};

export const getPagesCount = (page: TagSearchPage) => {
  const lastPageMatch = page(".pagination.actions li:not(.next, .previous)")
    .last()
    .text();
  return lastPageMatch ? parseIntOrThrow(lastPageMatch) : 0;
};

export const getTagsSearchResults = (page: TagSearchPage) => {
  return page("ol.tag.index.group > li")
    .map((_, li) => {
      const $li = page(li);
      const link = $li.find("a.tag").first();
      if (!link.length) {
        return null;
      }

      const name = link.text().trim();

      // Tags are in the format: "Type: Name (Works Count)"
      // Here we extract the works count.
      const worksMatch = $li.text().match(/\((\d+)\)\s*$/);
      const worksCount = parseIntOrThrow(worksMatch![1]);

      // Tags are in the format: "Type: Name (Works Count)"
      // Here we extract the type.
      const typeMatch = $li.text().match(/^([^:]+):/);
      if (!typeMatch) {
        throw new Error(`Invalid tag type: ${$li.text()}`);
      }
      const type = typeMatch[1].trim().toLowerCase();

      const classes = new Set(
        ($li.find("span").attr("class") ?? "").split(/\s+/).filter(Boolean)
      );

      return {
        name,
        type:
          type == "unsortedtag"
            ? "unsorted"
            : (type as TagSearchResultSummary["tags"][number]["type"]),
        canonical: classes.has("canonical"),
        worksCount,
      } as const;
    })
    .get()
    .filter((tag) => tag !== null);
};
