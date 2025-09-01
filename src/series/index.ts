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
import { parseId } from "src/utils";

export const getSeries = async ({
  seriesId,
}: {
  seriesId: `${number}`;
}): Promise<Series> => {
  const seriesPage = await loadSeriesPage(seriesId);

  const seriesWorks = getSeriesWorks(seriesPage);

  return {
    id: parseId(seriesId),
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
