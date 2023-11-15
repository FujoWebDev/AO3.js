import {
  Author,
  BasicSeries,
  WorkCategory,
  WorkRatings,
  WorkSummary,
  WorkWarnings,
} from "types/entities";

import { WorkPage } from "../page-loaders";

export const getWorkAuthors = ($workPage: WorkPage): "Anonymous" | Author[] => {
  const authorLinks = $workPage("h3.byline a[rel='author']");
  const authors: Author[] = [];

  if ($workPage("h3.byline").text().trim() === "Anonymous") {
    return "Anonymous";
  }

  if (authorLinks.length !== 0) {
    authorLinks.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/)!;

      authors.push({ username: username, pseud: decodeURI(pseud) });
    });
  }

  return authors;
};

export const getWorkTitle = ($workPage: WorkPage): string => {
  return $workPage("h2.title").text().trim();
};

export const getWorkWordCount = ($workPage: WorkPage): number => {
  return parseInt($workPage("dd.words").text().replaceAll(",", "").trim());
};

export const getWorkLanguage = ($workPage: WorkPage): string => {
  return $workPage("dd.language").text().trim();
};

export const getWorkRating = ($workPage: WorkPage): WorkRatings => {
  const rating = $workPage("dd.rating a.tag").text().trim();
  if (!Object.values(WorkRatings).includes(rating as WorkRatings)) {
    throw new Error("An unknown rating was found on the page");
  }
  return rating as WorkRatings;
};

export const getWorkCategory = ($workPage: WorkPage): WorkCategory[] | null => {
  if ($workPage("dd.category a.tag").length === 0) {
    return null;
  } else {
    const categories: WorkCategory[] = [];

    $workPage("dd.category a.tag").each(function (i, element) {
      const category = $workPage(element).text().trim();
      if (!Object.values(WorkCategory).includes(category as WorkCategory)) {
        throw new Error("An unknown category was found on the page");
      }

      categories[i] = category as WorkCategory;
    });
    return categories;
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
    const warning = $workPage(element).text().trim();

    if (!Object.values(WorkWarnings).includes(warning as WorkWarnings)) {
      throw new Error("An unknown warning was found on the page");
    }

    warnings[i] = warning as WorkWarnings;
  });
  return warnings;
};

export const getWorkCharacters = ($workPage: WorkPage): string[] => {
  const characters: string[] = [];

  $workPage("dd.character a.tag").each(function (i, character) {
    characters[i] = $workPage(character).text().trim();
  });
  return characters;
};

export const getWorkRelationships = ($workPage: WorkPage): string[] => {
  const ships: string[] = [];

  $workPage("dd.relationship a.tag").each(function (i, ship) {
    ships[i] = $workPage(ship).text().trim();
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
  const summary = $workPage(".preface .summary blockquote.userstuff").html();
  return summary ? summary.trim() : null;
};

export const getWorkSeries = ($workPage: WorkPage): BasicSeries[] => {
  const series: BasicSeries[] = [];

  const selector = "dd.series span.series";
  $workPage(selector).each((index) => {
    const seriesHtml = $workPage(`${selector}:nth-of-type(${index + 1})`);
    const matches = seriesHtml.text().trim().match(/\d+/);
    const link = seriesHtml.find("a:not(.next, .previous)");

    series[index] = {
      id: link.attr("href")!.replace("/series/", ""),
      name: link.text().trim(),
      index: matches!.length > 0 ? parseInt(matches![0]) : -1,
    };
  });

  return series;
};

export const getWorkCommentCount = ($workPage: WorkPage): number => {
  const comments = $workPage("dd.comments").text().trim();

  return comments ? parseInt(comments) : 0;
};

export const getWorkKudosCount = ($workPage: WorkPage) => {
  const kudos = $workPage("dd.kudos").text().trim();

  return kudos ? parseInt(kudos) : 0;
};

export const getWorkBookmarkCount = ($workPage: WorkPage) => {
  const bookmarks = $workPage("dd.bookmarks a").text().trim();

  return bookmarks ? parseInt(bookmarks) : 0;
};

export const getWorkHits = ($workPage: WorkPage) => {
  return parseInt($workPage("dd.hits").text().trim());
};

export const getWorkLocked = ($workPage: WorkPage) => {
  return !!$workPage("#signin > .heading").text();
};

// Chapter-specific (must be multi-chapter fic)
export const getChapterIndex = (
  $workPage: WorkPage
): NonNullable<WorkSummary["chapterInfo"]>["index"] => {
  const index = $workPage("#chapters h3.title a").text();
  return index ? parseInt(index.trim().replace("Chapter ", "")) : -1;
};

export const getChapterName = (
  $workPage: WorkPage
): NonNullable<WorkSummary["chapterInfo"]>["name"] => {
  const title = $workPage("#chapters h3.title").text().trim();
  // 2 characters is the length of query string
  return title && title.includes(":")
    ? title.slice(title.indexOf(": ") + 2)
    : null;
};

export const getChapterSummary = ($workPage: WorkPage): string | null => {
  const summary = $workPage(".chapter .summary blockquote.userstuff").html();
  return summary ? summary.trim() : null;
};
