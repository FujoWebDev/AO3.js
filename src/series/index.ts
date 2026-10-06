import { InvalidIDError, isValidArchiveId, parseArchiveId } from "src/utils";
import {
  getSeriesAuthors,
  getSeriesBookmarkCount,
  getSeriesCompletionStatus,
  getSeriesDescription,
  getSeriesNotes,
  getSeriesPublishDate,
  getSeriesTitle,
  getSeriesUpdateDate,
  getSeriesWordCount,
  getSeriesWorkCount,
  getSeriesWorks,
} from "./getters";

import type { Series } from "types/entities";
import { loadSeriesPage } from "src/page-loaders";
import { getPagesCount } from "src/tags/search-getters";

export const getSeries = async ({
  seriesId,
  page,
}: {
  seriesId: string | number;
  page?: number;
}): Promise<Series> => {
  if (!isValidArchiveId(seriesId)) {
    throw new InvalidIDError(seriesId, "series");
  }

  const seriesPage = await loadSeriesPage({ seriesId, page });

  const seriesWorks = getSeriesWorks(seriesPage);

  return {
    id: parseArchiveId(seriesId),
    name: getSeriesTitle(seriesPage),
    startedAt: getSeriesPublishDate(seriesPage),
    updatedAt: getSeriesUpdateDate(seriesPage),
    authors: getSeriesAuthors(seriesPage),
    description: getSeriesDescription(seriesPage),
    notes: getSeriesNotes(seriesPage),
    words: getSeriesWordCount(seriesPage),
    bookmarks: getSeriesBookmarkCount(seriesPage),
    complete: getSeriesCompletionStatus(seriesPage),
    workCount: getSeriesWorkCount(seriesPage),
    pages: {
      total: seriesWorks.length > 0 ? Math.max(1, getPagesCount(seriesPage)) : 0,
      current: page ?? 1,
    },
    works: seriesWorks,
  };
};
