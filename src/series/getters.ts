import { Author, Series, SeriesWorkSummary } from "../../types/entities";
import { CheerioAPI, load } from "cheerio/lib/slim";
import { SeriesPage, WorkPage } from "../page-loaders";
import {
  getWorkBookmarkCount,
  getWorkHits,
  getWorkKudosCount,
  getWorkLanguage,
  getWorkPublishedChapters,
  getWorkTotalChapters,
  getWorkWordCount,
} from "../works/work-getters";
import { getWorkDetailsFromUrl, getWorkUrl } from "../urls";

const monthMap: { [month: string]: string } = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const getSeriesTitle = ($seriesPage: SeriesPage): string => {
  return $seriesPage("h2.heading").text().trim();
};

export const getSeriesAuthors = (
  $seriesPage: SeriesPage
): Series["authors"] => {
  const authorLinks = $seriesPage("dl.meta a[rel=author]");
  const authors: Author[] = [];

  if (
    $seriesPage("dl.meta > dd:nth-of-type(1)").text().trim() === "Anonymous"
  ) {
    return [{ username: "Anonymous", pseud: "Anonymous", anonymous: true }];
  }

  if (authorLinks.length !== 0) {
    authorLinks.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/)!;

      authors.push({
        username: username,
        pseud: decodeURI(pseud),
        anonymous: false,
      });
    });
  }

  return authors;
};

export const getSeriesDescription = (
  $seriesPage: SeriesPage
): string | null => {
  const description = $seriesPage("dl.series blockquote.userstuff").html();
  return description ? description.trim() : null;
};

export const getSeriesNotes = ($seriesPage: SeriesPage): string | null => {
  const notes = $seriesPage("dl.series dd:nth-of-type(5)");
  if (notes.prevAll().first().text().trim() === "Notes:") {
    return notes.html()!.trim();
  } else {
    return null;
  }
};

export const getSeriesPublishDate = ($seriesPage: SeriesPage): string => {
  return $seriesPage("dl.series > dd:nth-of-type(2)").text().trim();
};

export const getSeriesUpdateDate = ($seriesPage: SeriesPage): string => {
  return $seriesPage("dl.series > dd:nth-of-type(3)").text().trim();
};

export const getSeriesWordCount = ($seriesPage: SeriesPage): number => {
  return parseInt(
    $seriesPage("dl.meta dl.stats dd:nth-of-type(1)")
      .text()
      .replaceAll(",", "")
      .trim()
  );
};

export const getSeriesWorkCount = ($seriesPage: SeriesPage): number => {
  return parseInt(
    $seriesPage("dl.meta dl.stats dd:nth-of-type(2)")
      .text()
      .replaceAll(",", "")
      .trim()
  );
};

export const getSeriesCompletionStatus = ($seriesPage: SeriesPage): boolean => {
  return $seriesPage("dl.stats dd:nth-of-type(3)").text().trim() === "Yes";
};

export const getSeriesBookmarkCount = ($seriesPage: SeriesPage): number => {
  return parseInt(
    $seriesPage("dl.meta dl.stats dd:nth-of-type(4)")
      .text()
      .replaceAll(",", "")
      .trim()
  );
};

export const getSeriesWorks = (
  $seriesPage: SeriesPage
): SeriesWorkSummary[] => {
  const works: SeriesWorkSummary[] = [];

  $seriesPage("ul.index > li.work").each((index, element) => {
    works[index] = getSeriesWork($seriesPage(element).html() as string);
  });

  return works;
};

// Helpers for series' works
interface SeriesWork extends CheerioAPI {
  kind: "SeriesWork";
}

const getSeriesWork = (workHtml: string): SeriesWorkSummary => {
  const work = load(workHtml);
  const $work = work as SeriesWork,
    $$work = work as WorkPage;

  const totalChapters = getWorkTotalChapters($$work);
  const publishedChapters = getWorkPublishedChapters($$work);

  const url = $work("a[href*='/works/']").attr("href") as string;
  const id = getWorkDetailsFromUrl({ url }).workId;

  return {
    id,
    url: getWorkUrl({ workId: id }),
    title: getSeriesWorkTitle($work),
    updatedAt: getSeriesWorkUpdateDate($work),

    summary: getSeriesWorkSummary($work),
    adult: false,
    fandoms: getSeriesWorkFandoms($work),
    tags: {
      characters: getSeriesWorkCharacters($work),
      relationships: getSeriesWorkRelationships($work),
      additional: getSeriesWorkAdditionalTags($work),
    },
    authors: getSeriesWorkAuthors($work),
    language: getWorkLanguage($$work),
    words: getWorkWordCount($$work),
    chapters: {
      published: publishedChapters,
      total: totalChapters,
    },
    complete: totalChapters !== null && totalChapters === publishedChapters,
    stats: {
      bookmarks: getWorkBookmarkCount($$work),
      kudos: getWorkKudosCount($$work),
      hits: getWorkHits($$work),
    },
  };
};

const getSeriesWorkTitle = ($work: SeriesWork) => {
  return $work("h4.heading a[href*='/works/']").text().trim();
};

const getSeriesWorkUpdateDate = ($work: SeriesWork) => {
  const [day, month, year] = $work("p.datetime").text().trim().split(" ");
  return `${year}-${monthMap[month]}-${day}`;
};

const getSeriesWorkSummary = ($work: SeriesWork) => {
  const summary = $work("blockquote.summary").html();
  return summary ? summary.trim() : null;
};

const getSeriesWorkFandoms = ($work: SeriesWork): string[] => {
  const fandoms: string[] = [];

  $work("h5.fandoms a.tag").each(function (i, element) {
    fandoms[i] = $work(element).text().trim();
  });
  return fandoms;
};

const getSeriesWorkCharacters = ($work: SeriesWork): string[] => {
  const characters: string[] = [];

  $work("li.characters a.tag").each(function (i, character) {
    characters[i] = $work(character).text().trim();
  });
  return characters;
};

const getSeriesWorkRelationships = ($work: SeriesWork): string[] => {
  const ships: string[] = [];

  $work("li.relationships a.tag").each(function (i, ship) {
    ships[i] = $work(ship).text().trim();
  });
  return ships;
};

const getSeriesWorkAdditionalTags = ($work: SeriesWork): string[] => {
  const tags: string[] = [];

  $work("li.freeforms a.tag").each(function (i) {
    tags[i] = $work(this).text().trim();
  });
  return tags;
};

const getSeriesWorkAuthors = (
  $work: SeriesWork
): SeriesWorkSummary["authors"] => {
  const authorLinks = $work("h4.heading a[rel='author']");
  const authors: Author[] = [];

  if ($work("h4.heading").text().split("by")[1].trim() === "Anonymous") {
    return [{ username: "Anonymous", pseud: "Anonymous", anonymous: true }];
  }

  if (authorLinks.length !== 0) {
    authorLinks.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/)!;

      authors.push({
        username: username,
        pseud: decodeURI(pseud),
        anonymous: false,
      });
    });
  }

  return authors;
};
