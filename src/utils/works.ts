import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";
import { getTagUrl } from "./tags";

// We create separate interfaces for each page type to make sure that the
// correct type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.
interface WorksPage extends CheerioAPI {
  kind: "WorksPage";
}

export interface WorkData {
  workId: string;
  chapterId?: string;
  collectionName?: string;
}

const getWorksUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

export const getWorksPage = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getWorksUrl(tagName))).data
  ) as WorksPage;
};

export const getTagId = ($worksPage: WorksPage) => {
  return $worksPage(".rss")[0]?.attribs["href"].split("/")[2] || null;
};

interface WorkPage extends CheerioAPI {
  kind: "WorkPage";
}

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

  return workUrl
};
