import cheerio, { CheerioAPI } from "cheerio";

import { TagWorksPage } from "../types/pages";
import axios from "axios";
import { getTagUrl } from "./tags";

const getWorksUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

export const getTagTagWorksPage = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getWorksUrl(tagName))).data
  ) as TagWorksPage;
};

export const getTagId = ($tagWorksPage: TagWorksPage) => {
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
