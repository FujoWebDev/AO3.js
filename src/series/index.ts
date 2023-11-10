import { loadSeriesPage } from "src/page-loaders";
import { Series } from "types/entities";
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
import { AxiosRequestConfig } from "axios";

export const getSeries = async ({
  seriesId,
  axiosOptions,
}: {
  seriesId: string;
  axiosOptions?: AxiosRequestConfig;
}): Promise<Series> => {
  const seriesPage = await loadSeriesPage(seriesId, axiosOptions);

  const seriesWorks = getSeriesWorks(seriesPage);

  return {
    id: seriesId,
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
