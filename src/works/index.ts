import {
  Author,
  Chapter,
  ChapterWorkSummary,
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
  loadChapterPage,
  loadChaptersIndexPage,
  loadWorkPage,
} from "../page-loaders";

export const getWork = async ({
  workId,
}: {
  workId: string;
}): Promise<WorkSummary | LockedWorkSummary> => {
  const workPage = await loadWorkPage(workId);

  if (getWorkLocked(workPage)) {
    return {
      locked: true,
    };
  }

  const totalChapters = getWorkTotalChapters(workPage);
  const publishedChapters = getWorkPublishedChapters(workPage);
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

export const getWorkChapter = async ({
  workId,
  chapterId,
}: {
  workId: string;
  chapterId: string;
}): Promise<ChapterWorkSummary | LockedWorkSummary> => {
  const page = await loadChapterPage(workId, chapterId);

  if (getWorkLocked(page)) {
    return {
      locked: true,
    };
  }

  const totalChapters = getWorkTotalChapters(page);
  const publishedChapters = getWorkPublishedChapters(page);
  return {
    id: workId,
    authors: getWorkAuthors(page),
    title: getWorkTitle(page),
    words: getWorkWordCount(page),
    language: getWorkLanguage(page),
    rating: getWorkRating(page),
    category: getWorkCategory(page),
    // TODO: figure out how to get this
    adult: false,
    fandoms: getWorkFandoms(page),
    tags: {
      warnings: getWorkWarnings(page),
      characters: getWorkCharacters(page),
      relationships: getWorkRelationships(page),
      additional: getWorkAdditionalTags(page),
    },
    publishedAt: getWorkPublishDate(page),
    updatedAt: getWorkUpdateDate(page),
    chapter:
      totalChapters !== 1
        ? {
            id: chapterId,
            index: getChapterIndex(page),
            name: getChapterName(page),
            summary: getWorkSummary(page),
          }
        : null,
    chapters: {
      published: publishedChapters,
      total: totalChapters,
    },
    complete: totalChapters !== null && totalChapters === publishedChapters,
    series: getWorkSeries(page),
    stats: {
      bookmarks: getWorkBookmarkCount(page),
      comments: getWorkCommentCount(page),
      hits: getWorkHits(page),
      kudos: getWorkKudosCount(page),
    },
    locked: false,
  };
};
