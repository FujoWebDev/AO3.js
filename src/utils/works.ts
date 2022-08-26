import {
  Author,
  WorkCategory,
  WorkRatings,
  WorkWarnings,
} from "../types/entities";
import { WorkPage, WorksFeed } from "../types/pages";
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

export const getWorkAuthor = ($workPage: WorkPage): "Anonymous" | Author[] => {
  const authorLinks = $workPage("h3.byline a[rel='author']");

  if (authorLinks.length !== 0) {
    const authors: Author[] = [];

    authorLinks.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/);

      authors.push({ username: username, pseud: decodeURI(pseud) });
    });

    return authors;
  } else if ($workPage("h3.byline").text().trim() === "Anonymous") {
    return "Anonymous";
  }
};

export const getWorkTitle = ($workPage: WorkPage): string => {
  return $workPage("h2.title").text().trim();
};

export const getWorkWordcount = ($workPage: WorkPage): number => {
  return parseInt($workPage("dd.words").text().trim());
};

export const getWorkLanguage = ($workPage: WorkPage): string => {
  return $workPage("dd.language").text().trim();
};

export const getWorkRating = ($workPage: WorkPage): WorkRatings => {
  const ao3Rating = $workPage("dd.rating a.tag").text().trim();
  if (!Object.values(WorkRatings).includes(ao3Rating as WorkRatings)) {
    throw new Error("An unknown rating was found on the page");
  }
  return ao3Rating as WorkRatings;
};

export const getWorkCategory = ($workPage: WorkPage): WorkCategory[] | null => {
  if ($workPage("dd.category a.tag").length === 0) {
    return null;
  } else {
    const category: WorkCategory[] = [];

    $workPage("dd.category a.tag").each(function (i, element) {
      const ao3Category = $workPage(element).text().trim();
      if (!Object.values(WorkCategory).includes(ao3Category as WorkCategory)) {
        throw new Error("An unknown category was found on the page");
      }

      category[i] = ao3Category as WorkCategory;
    });
    return category;
  }
};

export const getWorkFandoms = ($workPage: WorkPage): string[] => {
  const fandoms: string[] = [];

  $workPage("dd.fandom a.tag").each(function (i, element) {
    fandoms[i] = $workPage(element).text().trim();
  });
  return fandoms;
};

export const getWorkWarnings = ($workPage: WorkPage): WorkWarnings[] => {
  const warnings: WorkWarnings[] = [];

  $workPage("dd.warning a.tag").each(function (i, element) {
    const ao3Warnings = $workPage(element).text().trim();

    if (!Object.values(WorkWarnings).includes(ao3Warnings as WorkWarnings)) {
      throw new Error("An unknown warning was found on the page");
    }

    warnings[i] = ao3Warnings as WorkWarnings;
  });
  return warnings;
};

export const getWorkCharacters = ($workPage: WorkPage): string[] => {
  const characters: string[] = [];

  $workPage("dd.character a.tag").each(function (i, element) {
    characters[i] = $workPage(element).text().trim();
  });
  return characters;
};

export const getWorkRelationships = ($workPage: WorkPage): string[] => {
  const ships: string[] = [];

  $workPage("dd.relationship a.tag").each(function (i, element) {
    ships[i] = $workPage(element).text().trim();
  });
  return ships;
};

export const getWorkAdditionalTags = ($workPage: WorkPage): string[] => {
  const freeform: string[] = [];
  $workPage("dd.freeform ul.commas li").each(function (i) {
    freeform[i] = $workPage(this).text().trim();
  });
  return freeform;
};

export const getWorkUpdateDate = ($workPage: WorkPage): string | null => {
  const updated = $workPage("dd.status").text().trim();

  return updated ? updated : null;
};

export const getWorkPublishDate = ($workPage: WorkPage): string => {
  return $workPage("dd.published").text().trim();
};

export const getWorkPublishedChapters = ($workPage: WorkPage): number => {
  return parseInt($workPage("dd.chapters").text().trim().split("/")[0]);
};

export const getWorkTotalChapters = ($workPage: WorkPage): number | null => {
  const totalChapters = $workPage("dd.chapters").text().trim().split("/")[1];

  return totalChapters === "?" ? null : parseInt(totalChapters);
};

export const getWorkSummary = ($workPage: WorkPage): string | null => {
  const ao3Summary = $workPage(".summary blockquote.userstuff").html();

  return ao3Summary ? ao3Summary.trim() : null;
};

export const getWorkCommentCount = ($workPage: WorkPage): number | null => {
  const ao3Comments = $workPage("dd.comments").text().trim();

  return ao3Comments ? parseInt(ao3Comments) : null;
};

export const getWorkKudosCount = ($workPage: WorkPage): number | null => {
  const ao3Kudos = $workPage("dd.kudos").text().trim();

  return ao3Kudos ? parseInt(ao3Kudos) : null;
};

export const getWorkBookmarkCount = ($workPage: WorkPage): number | null => {
  const ao3Bookmarks = $workPage("dd.bookmarks a").text().trim();

  return ao3Bookmarks ? parseInt(ao3Bookmarks) : null;
};

export const getWorkHits = ($workPage: WorkPage): number => {
  return parseInt($workPage("dd.hits").text().trim());
};
