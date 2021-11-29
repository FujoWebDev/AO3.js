import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

// We create separate interfaces for each page type to make sure that the
// corret type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.
interface TagPage extends CheerioAPI {
  kind: "TagPage";
}

export type TagCategory =
  | "fandom"
  | "character"
  | "relationship"
  | "archive warning"
  | "additional tags";

export interface Tag {
  name: string;
  // Not all tags have user-facing IDs Example: additional tags.
  // TODO: figure out other types (or whether they can be extracted from somewhere else).
  id: string | null;
  category: TagCategory;
  canonical: boolean;
  common: boolean;
  // Canonical name will be the same as "name" on canonical tags, and different on tags
  // that have been synned to a canonical. It will be null when tags haven't been marked as
  // common and cannot be filtered on.
  canonicalName: string | null;
}

export const getTagUrl = (tagName: string) =>
  `https://archiveofourown.org/tags/${encodeURI(tagName)
    .replace("/", "*s*")
    .replace("&", "*a*")
    .replace(".", "*d*")}`;

export const getTagPage = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getTagUrl(tagName))).data
  ) as TagPage;
};

export const getTagCategory = ($tagPage: TagPage): TagCategory => {
  // This will look similar to "This tag belongs to the Character Category."
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  const category = categorySentence.match(
    /This tag belongs to the (.+) Category/
  )[1];
  return category.toLowerCase() as TagCategory;
};

export const hasMergers = ($tagPage: TagPage) => {
  return $tagPage(".merger").length > 0;
};

export const isCommon = ($tagPage: TagPage) => {
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  // TODO: check whether my assumption that all tags that have mergers have a parent that's
  // been marked as common.
  return (
    categorySentence.includes("It's a common tag.") || hasMergers($tagPage)
  );
};

export const isCanonical = ($tagPage: TagPage) => {
  return isCommon($tagPage) && !hasMergers($tagPage);
};

export const getTagName = ($tagPage: TagPage) => {
  return $tagPage($tagPage(".tag.profile h2")[0]).text();
};

export const getCanonical = ($tagPage: TagPage) => {
  if (isCanonical($tagPage)) {
    return getTagName($tagPage);
  }
  if (!hasMergers($tagPage)) {
    return null;
  }
  return $tagPage($tagPage(".merger a.tag")).text();
};
