import { loadSeriesPage } from "src/page-loaders";
import type { Series } from "types/entities";
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
import { isValidArchiveId, parseArchiveId } from "src/utils";

export const getSeries = async ({
  seriesId,
}: {
  seriesId: string | number;
}): Promise<Series> => {
  if (!isValidArchiveId(seriesId)) {
    throw new Error(`${seriesId} is not a valid series id`);
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
