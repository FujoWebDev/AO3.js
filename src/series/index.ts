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

export const getSeries = async ({
  seriesId,
}: {
  seriesId: string | number;
}): Promise<Series> => {
  if (!isValidArchiveId(seriesId)) {
    throw new InvalidIDError(seriesId, "series");
  }

  const seriesPage = await loadSeriesPage(seriesId);

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
    works: seriesWorks,
  };
};
