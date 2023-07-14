import { TagCategory } from "../types/entities";
import { TagWorksFeed } from "../types/pages";
import axios from "axios";
import cheerio from "cheerio";
import { getTagUrl } from "../urls";

export const loadTagPage = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getTagUrl(tagName))).data
  ) as TagWorksFeed;
};

export const getTagCategory = ($tagPage: TagWorksFeed): TagCategory => {
  // This will look similar to "This tag belongs to the Character Category."
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  const category = categorySentence.match(
    /This tag belongs to the (.+) Category/
  )?.[1];
  if (!category) {
    throw new Error("Category type not found for tag.");
  }
  return category.toLowerCase() as TagCategory;
};

export const hasMergers = ($tagPage: TagWorksFeed) => {
  return $tagPage(".merger").length > 0;
};

export const isCommon = ($tagPage: TagWorksFeed) => {
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  // TODO: check whether my assumption that all tags that have mergers have a parent that's
  // been marked as common.
  return (
    categorySentence.includes("It's a common tag.") || hasMergers($tagPage)
  );
};

export const isCanonical = ($tagPage: TagWorksFeed) => {
  return isCommon($tagPage) && !hasMergers($tagPage);
};

export const getTagName = ($tagPage: TagWorksFeed) => {
  return $tagPage($tagPage(".tag.profile h2")[0]).text();
};

export const getCanonical = ($tagPage: TagWorksFeed) => {
  if (isCanonical($tagPage)) {
    return getTagName($tagPage);
  }
  if (!hasMergers($tagPage)) {
    return null;
  }
  return $tagPage($tagPage(".merger a.tag")).text();
};
