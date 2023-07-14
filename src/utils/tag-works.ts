import { WorksFeed } from "../types/pages";
import axios from "axios";
import cheerio from "cheerio";
import { getTagUrl } from "./tags";

const getWorksFeedUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

export const getWorksFeed = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getWorksFeedUrl(tagName))).data
  ) as WorksFeed;
};

export const getTagTagWorksPage = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getWorksFeedUrl(tagName))).data
  ) as WorksFeed;
};

export const getTagId = ($tagWorksPage: WorksFeed) => {
  return $tagWorksPage(".rss")[0]?.attribs["href"].split("/")[2] || null;
};

export const getWorkUrl = ({
  workId,
  chapterId,
  collectionName,
}: {
  workId: string;
  chapterId?: string;
  collectionName?: string;
}) => {
  let workUrl = `https://archiveofourown.org`;

  if (collectionName) {
    workUrl += `/collections/${collectionName}`;
  }

  workUrl += `/works/${workId}`;

  if (chapterId) {
    workUrl += `/chapters/${chapterId}`;
  }

  return workUrl;
};
