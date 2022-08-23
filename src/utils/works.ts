import { WorksFeed, WorksPage } from "../types/pages";
import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";
import { getTagUrl } from "./tags";

const getWorksFeedUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

export const getWorksFeed = async (tagName: string) => {
  return cheerio.load(
    (await axios.get<string>(getWorksFeedUrl(tagName))).data
  ) as WorksFeed;
};

export const getTagId = ($worksFeed: WorksFeed) => {
  return $worksFeed(".rss")[0]?.attribs["href"].split("/")[2] || null;
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

export const getWorksPage = async (workId: string) => {
  return cheerio.load(
    (
      await axios.get<string>(`https://archiveofourown.org/works/${workId}`, {
        // We set a cookie to bypass the Terms of Service agreement modal that appears when viewing works as a guest, which prevented some selectors from working. Appending ?view_adult=true to URLs doesn't work for chaptered works since that part gets cleared when those are automatically redirected.
        headers: {
          Cookie: "view_adult=true;",
        },
      })
    ).data
  ) as WorksPage;
};

export const getWorkAuthor = ($worksPage: WorksPage) => {
  const authorLinks = $worksPage("h3.byline a[rel='author']");

  if (authorLinks.length !== 0) {
    const authors = [];

    authorLinks.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/);

      authors.push({ username: username, pseud: pseud });
    });

    return authors;
  } else if ($worksPage("h3.byline").text().trim() === "Anonymous") {
    return "Anonymous";
  }
};
