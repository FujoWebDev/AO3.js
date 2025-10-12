import type {
  Author,
  Chapter,
  WorkContent,
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
import {
  isValidArchiveId,
  parseArchiveId,
  isValidArchiveIdOrNullish,
} from "src/utils";

export const getWork = async ({
  workId,
  chapterId,
}: {
  workId: string | number;
  chapterId?: string | number;
}): Promise<WorkSummary | LockedWorkSummary> => {
  if (!isValidArchiveId(workId)) {
    throw new Error(`${workId} is not a valid work id`);
  }
  if (!isValidArchiveIdOrNullish(chapterId)) {
    throw new Error(`${workId} is not a valid chapter id`);
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
    throw new Error(`${workId} is not a valid work id`);
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
  chapter = 1,
}: {
  workId: string | number;
  chapter?: number;
}): Promise<WorkContent> => {
  if (!isValidArchiveId(workId)) {
    throw new Error(`${workId} is not a valid work id`);
  }

  // For single-chapter works or chapter 1, we can just load the work page directly
  // For multi-chapter works with a specific chapter, we need to get the chapter ID
  let chapterId: number | undefined = undefined;

  if (chapter !== 1) {
    // We need to get the chapters list to find the chapter ID for the requested chapter
    const chaptersPage = await loadChaptersIndexPage({ workId });
    const chapters = getChaptersList(chaptersPage);

    if (chapter < 1 || chapter > chapters.length) {
      throw new Error(`Chapter ${chapter} does not exist for work ${workId}`);
    }

    chapterId = chapters[chapter - 1].id;
  }

  const workPage = await loadWorkPage({ workId, chapterId });

  // Extract the story content
  // Try AO3 structure first (.userstuff.module[role="article"])
  let content = workPage('.userstuff.module[role="article"]').html();
  // Fall back to simpler structure (#chapters .userstuff)
  if (!content) {
    content = workPage("#chapters .userstuff").html();
  }

  // Extract author's notes at the beginning (in the chapter preface, before the content)
  const startNotes = workPage(
    ".chapter.preface #notes.notes.module .userstuff"
  ).html();

  // Extract end notes (after the content)
  const endNotes = workPage(
    ".chapter.preface .end.notes.module .userstuff"
  ).html();

  // Extract summary (work summary or chapter summary)
  const summary = workPage(".preface .summary.module .userstuff").html();

  return {
    content: content ? content.trim() : null,
    startNotes: startNotes ? startNotes.trim() : null,
    endNotes: endNotes ? endNotes.trim() : null,
    summary: summary ? summary.trim() : null,
  };
};
