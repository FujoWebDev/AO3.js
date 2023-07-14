import { TagWorksAtomFeed, TagWorksFeed } from "../types/pages";

import axios from "axios";
import cheerio from "cheerio";
import { getTagUrl } from "./page-getters";

const getTagWorksFeedUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

export const loadTagWorksFeed = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getTagWorksFeedUrl(tagName))).data
  ) as TagWorksFeed;
};

const getTagWorksFeedAtomUrl = (tagId: string) =>
  `https://archiveofourown.org/tags/${tagId}/feed.atom`;

export const loadTagFeedAtomPage = async ({ tagId }: { tagId: string }) => {
  return cheerio.load(
    (await axios.get<string>(getTagWorksFeedAtomUrl(tagId))).data
  ) as TagWorksAtomFeed;
};

export const getTagNameFromFeed = async ($feedPage: TagWorksAtomFeed) => {
  const feedTitle = $feedPage($feedPage("title")[0].children[0]).text();

  return feedTitle.match(/AO3 works tagged '(.+)'/)?.[1] || null;
};

export const getTagId = ($tagWorksPage: TagWorksFeed) => {
  return $tagWorksPage(".rss")[0]?.attribs["href"].split("/")[2] || null;
};
