import type {
  Author,
  Chapter,
  LockedWorkSummary,
  WorkContent,
  WorkSummary,
} from "types/entities";
import {
  InvalidIDError,
  isValidArchiveId,
  isValidArchiveIdOrNullish,
  parseArchiveId,
} from "src/utils";
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
  getWorkContentHtml,
  getWorkContentSummary,
  getWorkEndNotes,
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
  getWorkStartNotes,
  getWorkSummary,
  getWorkTitle,
  getWorkTotalChapters,
  getWorkUpdateDate,
  getWorkWarnings,
  getWorkWordCount,
} from "./work-getters";
import {
  getChaptersList,
  getWorkAuthors as getWorkAuthorsFromChaptersIndex,
  getWorkTitle as getWorkTitleFromChaptersIndex,
} from "./chapter-getters";
import { loadChaptersIndexPage, loadWorkPage } from "src/page-loaders";

export const getWork = async ({
  workId,
  chapterId,
}: {
  workId: string | number;
  chapterId?: string | number;
}): Promise<WorkSummary | LockedWorkSummary> => {
  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }
  if (!isValidArchiveIdOrNullish(chapterId)) {
    throw new InvalidIDError(workId, "chapter");
  }

  const workPage = await loadWorkPage({ workId, chapterId });
  const id = parseArchiveId(workId);

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
          id: parseArchiveId(chapterId),
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
  workId: string | number;
}): Promise<{
  title: string;
  authors: "Anonymous" | Author[];
  workId: number;
  chapters: Chapter[];
}> => {
  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }
  const page = await loadChaptersIndexPage({ workId });

  return {
    title: getWorkTitleFromChaptersIndex(page),
    authors: getWorkAuthorsFromChaptersIndex(page),
    workId: parseArchiveId(workId),
    chapters: getChaptersList(page),
  };
};

export const getWorkContent = async ({
  workId,
  chapterId = null,
}: {
  workId: string | number;
  chapterId?: string | number | null;
}): Promise<WorkContent> => {
  if (!isValidArchiveId(workId) || !isValidArchiveIdOrNullish(chapterId)) {
    throw new InvalidIDError(workId, "work");
  }
  const workPage = await loadWorkPage({
    workId,
    chapterId: chapterId ?? undefined,
  });

  return {
    content: getWorkContentHtml(workPage),
    startNotes: getWorkStartNotes(workPage),
    endNotes: getWorkEndNotes(workPage),
    summary: getWorkContentSummary(workPage),
  };
};
