import type {
  Author,
  Chapter,
  ChapterText,
  WorkContentFull,
  LockedWorkSummary,
  WorkContentChapter,
  WorkSummary,
} from "types/entities";
import {
  InvalidIDError,
  isValidArchiveId,
  isValidArchiveIdOrNullish,
  parseArchiveId,
} from "src/utils";
import {
  getMultiChapterId,
  getChapterIndex,
  getChapterName,
  getChapterSummary,
  getWorkAdditionalTags,
  getWorkAdult,
  getWorkAuthors,
  getWorkBookmarkCount,
  getWorkCategory,
  getWorkCharacters,
  getWorkCommentCount,
  getWorkContentBody,
  getWorkLevelNotes,
  getChapterEndNotes,
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
  getChapterStartNotes,
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
import {
  loadChaptersIndexPage,
  loadFullWorkChapter,
  loadWorkPage,
  type WorkPage,
} from "src/page-loaders";
import { getArchiveBaseUrl, getAsShortUrl, getWorkUrl } from "src/urls";

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
  return getWorkDetails(workPage, { workId, chapterId });
};

// Gets the details of a work from a work page. This is used by getWork 
// and getWorkContent, which both load a work page and share this same data.
const getWorkDetails = (
  workPage: WorkPage,
  {
    workId,
    chapterId,
  }: { workId: string | number; chapterId?: string | number | null },
): WorkSummary | LockedWorkSummary => {
  const id = parseArchiveId(workId);

  const source = "website";
  const host = new URL(getArchiveBaseUrl()).hostname;

  const url = getWorkUrl({ workId: id });
  const shortUrl = getAsShortUrl({ url });

  if (getWorkLocked(workPage)) {
    return { id, source, host, url, shortUrl, locked: true };
  }

  const totalChapters = getWorkTotalChapters(workPage);
  const publishedChapters = getWorkPublishedChapters(workPage);
  const chapterIndex = getChapterIndex(workPage);

  return {
    id,
    source,
    host,
    url,
    shortUrl,
    authors: getWorkAuthors(workPage),
    title: getWorkTitle(workPage),
    words: getWorkWordCount(workPage),
    language: getWorkLanguage(workPage),
    rating: getWorkRating(workPage),
    category: getWorkCategory(workPage),
    adult: getWorkAdult(workPage),
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

export function getWorkContent(options: {
  workId: string | number;
  fullWork: true;
}): Promise<WorkContentFull | LockedWorkSummary>;
export function getWorkContent(options: {
  workId: string | number;
  chapterId?: string | number | null;
  fullWork?: false;
}): Promise<WorkContentChapter | LockedWorkSummary>;
export async function getWorkContent({
  workId,
  chapterId = null,
  fullWork = false,
}: {
  workId: string | number;
  chapterId?: string | number | null;
  fullWork?: boolean;
}): Promise<WorkContentChapter | WorkContentFull | LockedWorkSummary> {
  if (!isValidArchiveId(workId) || !isValidArchiveIdOrNullish(chapterId)) {
    throw new InvalidIDError(workId, "work");
  }

  if (fullWork) {
    const workPage = await loadWorkPage({ workId, fullWork: true });
    const work = getWorkDetails(workPage, { workId });
    // A locked work's page has no text or notes to read
    if (work.locked) {
      return work;
    }
    return {
      ...work,
      content: {
        notes: getWorkLevelNotes(workPage),
        chapters: getFullWorkChapters(workPage),
      },
    };
  }

  const workPage = await loadWorkPage({
    workId,
    chapterId: chapterId ?? undefined,
  });

  const work = getWorkDetails(workPage, { workId, chapterId });
  if (work.locked) {
    return work;
  }
  return {
    ...work,
    content: {
      notes: getWorkLevelNotes(workPage),
      chapter: {
        summary: getChapterSummary(workPage),
        notes: {
          start: getChapterStartNotes(workPage),
          end: getChapterEndNotes(workPage),
        },
        html: getWorkContentBody(workPage),
      },
    },
  };
}

const getFullWorkChapters = (workPage: WorkPage): ChapterText[] => {
  const chapterElements = workPage("#chapters > .chapter").toArray();

  // Single-chapter works render their text straight inside #chapters,
  // with no per-chapter preface.
  if (chapterElements.length === 0) {
    return [
      {
        id: null,
        index: 1,
        title: null,
        summary: null,
        notes: { start: null, end: null },
        html: getWorkContentBody(workPage),
      },
    ];
  }

  return chapterElements.map((chapterElement, position) => {
    const chapterPage = loadFullWorkChapter(
      workPage(chapterElement).prop("outerHTML") ?? "",
    );
    return {
      id: getMultiChapterId(chapterPage),
      index: position + 1,
      title: getChapterName(chapterPage),
      summary: getChapterSummary(chapterPage),
      notes: {
        start: getChapterStartNotes(chapterPage),
        end: getChapterEndNotes(chapterPage),
      },
      html: getWorkContentBody(chapterPage),
    };
  });
};
