import cheerio, { CheerioAPI } from "cheerio";

import { FeedPage } from "../types/pages";
import axios from "axios";

const getFeedUrl = (tagId: string) =>
  `https://archiveofourown.org/tags/${tagId}/feed.atom`;

export const getFeedPage = async ({ tagId }: { tagId: string }) => {
  return cheerio.load(
    (await axios.get<string>(getFeedUrl(tagId))).data
  ) as FeedPage;
};

export const getTagNameFromFeed = async ($feedPage: FeedPage) => {
  const feedTitle = $feedPage($feedPage("title")[0].children[0]).text();

  return feedTitle.match(/AO3 works tagged '(.+)'/)?.[1] || null;
};
