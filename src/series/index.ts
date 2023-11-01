import { loadSeriesPage } from "src/page-loaders";
import { Series } from "types/entities";
import {
  getSeriesAuthors,
  getSeriesBookmarkCount,
  getSeriesCompletionStatus,
  getSeriesDescription,
  getSeriesPublishDate,
  getSeriesTitle,
  getSeriesUpdateDate,
  getSeriesWordCount,
  getSeriesWorkCount,
  getSeriesWorks,
} from "./getters";

export const getSeries = async ({
  seriesId,
}: {
  seriesId: string;
}): Promise<Series> => {
  const seriesPage = await loadSeriesPage(seriesId);

  return {
    id: seriesId,
    title: getSeriesTitle(seriesPage),
    begunAt: getSeriesPublishDate(seriesPage),
    updatedAt: getSeriesUpdateDate(seriesPage),
    authors: getSeriesAuthors(seriesPage),
    description: getSeriesDescription(seriesPage),
    words: getSeriesWordCount(seriesPage),
    stats: {
      works: getSeriesWorkCount(seriesPage),
      bookmarks: getSeriesBookmarkCount(seriesPage),
    },
    completed: getSeriesCompletionStatus(seriesPage),
    works: getSeriesWorks(seriesPage),
  };
};
