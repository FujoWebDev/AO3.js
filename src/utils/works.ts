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
 workUrl: string;
 workId: string;
 chapterId: string | null;
 collectionName: string | null;
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

export const getWorkIdFromUrl = (url: string) => {
 return url.match(/works\/(\d+)/)[1];
};

export const getChapterIdFromUrl = (url: string) => {
 const chapterId = url.match(/chapters\/(\d+)/);
 if (chapterId) return chapterId[1];
};

// ! this grabs the collection name from the URL but a work can be in more than one collection
export const getCollectionNameFromUrl = (url: string) => {
 const collectionName = url.match(/collections\/(\w+)/);
 if (collectionName) return collectionName[1];
};

export const getWorkUrl = 
({ workId, chapterId, collectionName }: {workId: string; chapterId?: string; collectionName?: string;}) => {
if (chapterId && collectionName) {
  return `https://archiveofourown.org/collections/${collectionName}/works/${workId}/chapters/${chapterId}`
}
else if (chapterId) {
  return `https://archiveofourown.org/works/${workId}/chapters/${chapterId}`
}
else if (collectionName) {
  return `https://archiveofourown.org/collections/${collectionName}/works/${workId}`
}
else return `https://archiveofourown.org/works/${workId}`
}
