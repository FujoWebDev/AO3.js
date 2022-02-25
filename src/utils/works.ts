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
  published: string;
  words: string;
  chapters: string;
}

// Start of methods that fetch required fields
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
  return $workPage("dd.published").text().trim();
};
export const getWorkWords = ($workPage: WorkPage) => {
  return $workPage("dd.words").text().trim();
};
export const getWorkChapters = ($workPage: WorkPage) => {
  return $workPage("dd.chapters").text().trim();
};
// End of methods that fetch required fields
