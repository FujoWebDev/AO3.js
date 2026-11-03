import {
  ArchiveId,
  Author,
  BasicSeries,
  ContentNotes,
  WorkCategory,
  WorkRatings,
  WorkSummary,
  WorkWarnings,
} from "types/entities";
import { load } from "cheerio/slim";
import { isValidArchiveId, parseArchiveId } from "src/utils";
import { getAuthorFromUrl, getWorkDetailsFromUrl } from "src/urls";

import { WorkPage } from "src/page-loaders";
import type { WorkBlurb } from "src/works/blurb-getters";

export const ANONYMOUS_AUTHOR: Author = {
  username: "Anonymous",
  pseud: "Anonymous",
  anonymous: true,
};

const ADULT_RATINGS: readonly WorkRatings[] = [
  WorkRatings.EXPLICIT,
  WorkRatings.MATURE,
  WorkRatings.NOT_RATED,
];

export const isWorkRating = (value: string): value is WorkRatings => {
  return Object.values<string>(WorkRatings).includes(value);
}

export const isWorkCategory = (value: string): value is WorkCategory => {
  return Object.values<string>(WorkCategory).includes(value);
}

export const isWorkWarning = (value: string): value is WorkWarnings => {
  return Object.values<string>(WorkWarnings).includes(value);
}

export const isAdultRating = (rating: WorkRatings) =>
  ADULT_RATINGS.includes(rating);

export const getWorkAuthors = ($workPage: WorkPage): Author[] => {
  const authorLinks = $workPage("h3.byline a[rel='author']");
  const authors: Author[] = [];

  if ($workPage("h3.byline").text().trim() === "Anonymous") {
    return [ANONYMOUS_AUTHOR];
  }

  if (authorLinks.length !== 0) {
    authorLinks.each((i, element) => {
      authors.push(getAuthorFromUrl({ url: element.attribs.href }));
    });
  }

  return authors;
};

export const getWorkTitle = ($workPage: WorkPage): string => {
  return $workPage("h2.title").text().trim();
};

export const getWorkWordCount = ($workPage: WorkPage | WorkBlurb): number => {
  return parseInt($workPage("dd.words").text().replaceAll(",", "").trim());
};

export const getWorkLanguage = ($workPage: WorkPage | WorkBlurb): string => {
  return $workPage("dd.language").text().trim();
};

export const getWorkRating = ($workPage: WorkPage): WorkRatings => {
  const rating = $workPage("dd.rating a.tag").text().trim();
  if (!isWorkRating(rating)) {
    throw new Error(`An unknown rating was found on the page: ${rating}`);
  }
  return rating;
};

export const getWorkCategory = ($workPage: WorkPage): WorkCategory[] | null => {
  if ($workPage("dd.category a.tag").length === 0) {
    return null;
  } else {
    const categories: WorkCategory[] = [];

    $workPage("dd.category a.tag").each(function (i, element) {
      const category = $workPage(element).text().trim();
      if (!isWorkCategory(category)) {
        throw new Error("An unknown category was found on the page");
      }

      categories[i] = category;
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

    if (!isWorkWarning(warning)) {
      throw new Error("An unknown warning was found on the page");
    }

    warnings[i] = warning;
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

export const getWorkPublishedChapters = (
  $workPage: WorkPage | WorkBlurb
): number => {
  return parseInt($workPage("dd.chapters").text().trim().split("/")[0]);
};

export const getWorkTotalChapters = (
  $workPage: WorkPage | WorkBlurb
): number | null => {
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

    // Ensure id extracted is numeric
    const id = link.attr("href")!.replace("/series/", "");
    if (!isValidArchiveId(id)) {
      throw new Error(`Found non-numberical id in work ${id}}`);
    }

    series[index] = {
      id: parseArchiveId(id),
      name: link.text().trim(),
      index: matches!.length > 0 ? parseInt(matches![0]) : -1,
    };
  });

  return series;
};

export const getWorkCommentCount = ($workPage: WorkPage): number => {
  const comments = $workPage("dd.comments").text().replaceAll(",", "").trim();

  return comments ? parseInt(comments) : 0;
};

export const getWorkKudosCount = ($workPage: WorkPage | WorkBlurb) => {
  const kudos = $workPage("dd.kudos").text().replaceAll(",", "").trim();

  return kudos ? parseInt(kudos) : 0;
};

export const getWorkBookmarkCount = ($workPage: WorkPage | WorkBlurb) => {
  const bookmarks = $workPage("dd.bookmarks a")
    .text()
    .replaceAll(",", "")
    .trim();

  return bookmarks ? parseInt(bookmarks) : 0;
};

export const getWorkHits = ($workPage: WorkPage | WorkBlurb) => {
  return parseInt($workPage("dd.hits").text().replaceAll(",", "").trim());
};

export const getWorkLocked = ($workPage: WorkPage) => {
  return !!$workPage("#signin > .heading").text();
};

export const getWorkAdult = ($workPage: WorkPage): boolean => {
  return isAdultRating(getWorkRating($workPage));
};

// Leaves out AO3's hidden "Chapter Text" heading, which is only there for
// screen readers and is not in PDFs/EPUBs.
export const getWorkContentBody = ($workPage: WorkPage): string => {
  let $content = $workPage('.userstuff.module[role="article"]').first();
  // Works with multiple chapters have a different structure for the content
  // compared to one-shots.
  if ($content.length === 0) {
    $content = $workPage("#chapters .userstuff").first();
  }
  if ($content.length === 0) {
    throw new Error("No content found on work page");
  }
  const $body = load($content.html() ?? "");
  $body(".landmark").remove();
  return ($body.html() ?? "").trim();
};

export const getChapterStartNotes = ($workPage: WorkPage): string | null => {
  const startNotes = $workPage(
    ".chapter.preface #notes.notes.module .userstuff",
  ).html();
  return startNotes ? startNotes.trim() : null;
};

export const getChapterEndNotes = ($workPage: WorkPage): string | null => {
  const endNotes = $workPage(
    ".chapter.preface .end.notes.module .userstuff",
  ).html();
  return endNotes ? endNotes.trim() : null;
};

// The work's own notes. AO3 shows the start notes on the work's first chapter
// and the end notes on its last.
export const getWorkLevelNotes = ($workPage: WorkPage): ContentNotes => {
  const notes = (selector: string) => {
    const html = $workPage(selector).first().html();
    return html ? html.trim() : null;
  };
  return {
    start: notes("#workskin > .preface.group > .notes.module .userstuff"),
    end: notes("#work_endnotes .userstuff"),
  };
};

// Chapter-specific (must be multi-chapter fic)
export const getMultiChapterId = ($workPage: WorkPage): ArchiveId | null => {
  const chapterUrl = $workPage("#chapters h3.title a").attr("href");
  const chapterId = chapterUrl
    ? getWorkDetailsFromUrl({ url: chapterUrl }).chapterId
    : undefined;
  return chapterId ? parseArchiveId(chapterId) : null;
};

export const getChapterIndex = (
  $workPage: WorkPage,
): NonNullable<WorkSummary["chapterInfo"]>["index"] => {
  const index = $workPage("#chapters h3.title a").text();
  return index ? parseInt(index.trim().replace("Chapter ", "")) : -1;
};

export const getChapterName = (
  $workPage: WorkPage,
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
