import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";
import { getTagUrl } from "./tags";
import { emitWarning } from "process";

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

  return workUrl;
};

export const getWorkPage = async (workId: string) => {
  return cheerio.load(
    (
      await axios.get<string>(`https://archiveofourown.org/works/${workId}`, {
        // We set a cookie to bypass the Terms of Service agreement modal that appears when viewing works as a guest, which prevented some selectors from working. Appending ?view_adult=true to URLs doesn't work for chaptered works since that part gets cleared when those are automatically redirected.
        headers: {
          Cookie: "view_adult=true;",
        },
      })
    ).data
  ) as WorkPage;
};

export interface Work {
  author: string;
  title: string;
  rating: string[];
  warning: string[];
  fandom: string[];
  language: string;
  published: Date;
  words: string;
  publishedChapters: number;
  totalChapters: number | null;
  category: string[];
  relationship: string[];
  character: string[];
  freeform: string[];
  series: string | null;
  collections: string | null;
  updated: Date;
}

export const getWorkAuthor = ($workPage: WorkPage) => {
  const author = [];
  $workPage("h3.byline").each(function (i, element) {
    author[i] = $workPage(element).text().trim();
  });
  return author.join();
};

export const getWorkTitle = ($workPage: WorkPage) => {
  return $workPage("h2.title").text().trim();
};

export const getWorkRating = ($workPage: WorkPage) => {
  const rating = [];
  $workPage("dd.rating ul.commas li").each(function (i, element) {
    rating[i] = $workPage(element).text().trim();
  });
  return rating;
};

export const getWorkWarning = ($workPage: WorkPage) => {
  const warning = [];

  $workPage("dd.warning ul.commas li").each(function (i, element) {
    warning[i] = $workPage(element).text().trim();
  });
  return warning;
};

export const getWorkFandom = ($workPage: WorkPage) => {
  const fandom = [];
  $workPage("dd.fandom ul.commas li").each(function (i, element) {
    fandom[i] = $workPage(element).text().trim();
  });
  return fandom;
};

export const getWorkLanguage = ($workPage: WorkPage) => {
  return $workPage("dd.language").text().trim();
};

export const getWorkPublished = ($workPage: WorkPage) => {
  return new Date(Date.parse($workPage("dd.published").text().trim()));
};

export const getWorkWords = ($workPage: WorkPage) => {
  return $workPage("dd.words").text().trim();
};

export const getWorkPublishedChapters = ($workPage: WorkPage) => {
  return parseInt($workPage("dd.chapters").text().trim().split("/")[0]);
};

export const getWorkTotalChapters = ($workPage: WorkPage) => {
  const totalChapters = $workPage("dd.chapters").text().trim().split("/")[1];
  if (totalChapters === "?") {
    return null;
  }
  return parseInt(totalChapters);
};

export const getWorkCategory = ($workPage: WorkPage) => {
  const category = [];

  $workPage("dd.category ul.commas li").each(function (i, element) {
    category[i] = $workPage(element).text().trim();
  });
  return category;
};

export const getWorkRelationship = ($workPage: WorkPage) => {
  const relationship = [];
  $workPage("dd.relationship ul.commas li").each(function (i, element) {
    relationship[i] = $workPage(element).text().trim();
  });
  return relationship;
};

export const getWorkCharacter = ($workPage: WorkPage) => {
  const character = [];
  $workPage("dd.character ul.commas li").each(function (i) {
    character[i] = $workPage(this).text().trim();
  });
  return character;
};

export const getWorkFreeform = ($workPage: WorkPage) => {
  const freeform = [];
  $workPage("dd.freeform ul.commas li").each(function (i) {
    freeform[i] = $workPage(this).text().trim();
  });
  return freeform;
};

export const getWorkSeries = ($workPage: WorkPage) : string | null => {
  const series = $workPage("dd.series").text().trim();
  if (!series) {
    return null;
  }
  return series;
};

export const getWorkCollections = ($workPage: WorkPage) : string | null => {
  const collections = $workPage("dd.collections").text().trim();
  if (!collections) {
    return null;
  }
  return collections;
};

export const getWorkUpdated = ($workPage: WorkPage) => {
  const updated = $workPage("dd.status").text().trim();
  if (!updated) {
    return null;
  }
  return new Date(Date.parse(updated));
};
