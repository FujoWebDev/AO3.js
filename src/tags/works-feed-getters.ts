import type { TagWorksAtomFeed, TagWorksFeed } from "../page-loaders";

export const getTagNameFromFeed = async ($feedPage: TagWorksAtomFeed) => {
  const feedTitle = $feedPage($feedPage("title")[0].children[0]).text();

  return feedTitle.match(/AO3 works tagged '(.+)'/)?.[1] || null;
};

export const getTagId = ($tagWorksPage: TagWorksFeed) => {
  return $tagWorksPage(".rss")[0]?.attribs["href"].split("/")[2] || null;
};
