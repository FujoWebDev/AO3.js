import type {
  Author,
  Chapter,
  ArchiveId,
  LockedWorkSummary,
  WorkSummary,
} from "types/entities";
import {
  getChaptersList,
  getWorkAuthors as getWorkAuthorsFromChaptersIndex,
  getWorkTitle as getWorkTitleFromChaptersIndex,
} from "./chapter-getters";
import {
  getChapterIndex,
  getChapterName,
  getChapterSummary,
  getWorkAdditionalTags,
  getWorkAuthors,
  getWorkBookmarkCount,
  getWorkCategory,
  getWorkCharacters,
  getWorkCommentCount,
  getWorkFandoms,
  getWorkHits,
  getWorkKudosCount,
  getWorkLanguage,
  getWorkLocked,
  getWorkPublishDate,
  getWorkPublishedChapters,
  getWorkRating,
  getWorkRelationships,
  getWorkSeries,
  getWorkSummary,
  getWorkTitle,
  getWorkTotalChapters,
  getWorkUpdateDate,
  getWorkWarnings,
  getWorkWordCount,
} from "./work-getters";
import { loadChaptersIndexPage, loadWorkPage } from "src/page-loaders";
import { parseId } from "src/utils";

export const getWork = async ({
  workId,
  chapterId,
}: {
  workId: ArchiveId;
  chapterId?: ArchiveId;
}): Promise<WorkSummary | LockedWorkSummary> => {
  const workPage = await loadWorkPage({ workId, chapterId });
  const id = parseId(workId);

  if (getWorkLocked(workPage)) {
    return {
      id,
      locked: true,
    };
  }

  const totalChapters = getWorkTotalChapters(workPage);
  const publishedChapters = getWorkPublishedChapters(workPage);
  const chapterIndex = getChapterIndex(workPage);

  return {
    id,
    authors: getWorkAuthors(workPage),
    title: getWorkTitle(workPage),
    words: getWorkWordCount(workPage),
    language: getWorkLanguage(workPage),
    rating: getWorkRating(workPage),
    category: getWorkCategory(workPage),
    // TODO: figure out how to get this
    adult: false,
    fandoms: getWorkFandoms(workPage),
    tags: {
      warnings: getWorkWarnings(workPage),
      characters: getWorkCharacters(workPage),
      relationships: getWorkRelationships(workPage),
      additional: getWorkAdditionalTags(workPage),
    },
    publishedAt: getWorkPublishDate(workPage),
    updatedAt: getWorkUpdateDate(workPage),
    chapters: {
      published: publishedChapters,
      total: totalChapters,
    },
    chapterInfo: chapterId
      ? {
          id: parseId(chapterId),
          index: chapterIndex,
          name: getChapterName(workPage),
          summary: getChapterSummary(workPage),
        }
      : null,
    complete: totalChapters !== null && totalChapters === publishedChapters,
    series: getWorkSeries(workPage),
    summary:
      chapterIndex === 1 || totalChapters === 1
        ? getWorkSummary(workPage)
        : null,
    stats: {
      bookmarks: getWorkBookmarkCount(workPage),
      comments: getWorkCommentCount(workPage),
      hits: getWorkHits(workPage),
      kudos: getWorkKudosCount(workPage),
    },
    locked: false,
  };
};

export const getWorkWithChapters = async ({
  workId,
}: {
  workId: ArchiveId;
}): Promise<{
  title: string;
  authors: "Anonymous" | Author[];
  workId: number;
  chapters: Chapter[];
}> => {
  const page = await loadChaptersIndexPage({ workId });

  return {
    title: getWorkTitleFromChaptersIndex(page),
    authors: getWorkAuthorsFromChaptersIndex(page),
    workId: parseId(workId),
    chapters: getChaptersList(page),
  };
};
