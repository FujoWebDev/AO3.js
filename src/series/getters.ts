import type { Author, Series, WorkBlurbSummary } from "types/entities";
import type { SeriesPage } from "src/page-loaders";
import { getAuthorFromUrl } from "src/urls";
import { getWorkBlurb } from "src/works/blurb-getters";

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
      authors.push(getAuthorFromUrl({ url: element.attribs.href }));
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
): WorkBlurbSummary[] => {
  const works: WorkBlurbSummary[] = [];

  $seriesPage("ul.index > li.work").each((index, element) => {
    works[index] = getWorkBlurb($seriesPage(element).html() as string);
  });

  return works;
};
