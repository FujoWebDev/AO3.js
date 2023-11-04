import {
  Author,
  Chapter,
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
import {
  loadChaptersIndexPage,
  loadWorkPage,
} from "../page-loaders";

export const getWork = async ({
  workId,
  chapterId,
}: {
  workId: string;
  chapterId?: string;
}): Promise<WorkSummary | LockedWorkSummary> => {
  const workPage = await loadWorkPage(workId, chapterId);

  if (getWorkLocked(workPage)) {
    return {
      locked: true,
    };
  }

  const totalChapters = getWorkTotalChapters(workPage);
  const publishedChapters = getWorkPublishedChapters(workPage);
  const chapterIndex = totalChapters !== 1 ? getChapterIndex(workPage) : -1;

  return {
    id: workId,
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
    chapter:
      chapterId && totalChapters !== 1
        ? {
            id: chapterId,
            index: chapterIndex,
            name: getChapterName(workPage),
            summary: chapterIndex !== 1 ? getWorkSummary(workPage) : null,
          }
        : null,
    chapters: {
      published: publishedChapters,
      total: totalChapters,
    },
    complete: totalChapters !== null && totalChapters === publishedChapters,
    series: getWorkSeries(workPage),
    summary: getWorkSummary(workPage),
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
  workId: string;
}): Promise<{
  title: string;
  authors: "Anonymous" | Author[];
  workId: string;
  chapters: Chapter[];
}> => {
  const page = await loadChaptersIndexPage({ workId });

  return {
    title: getWorkTitleFromChaptersIndex(page),
    authors: getWorkAuthorsFromChaptersIndex(page),
    workId,
    chapters: getChaptersList(page),
  };
};
