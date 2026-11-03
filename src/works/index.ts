import type {
  ArchiveId,
  Author,
  Chapter,
  ChapterText,
  LockedWorkSummary,
  WorkSummary,
  WorkText,
  WorkWithText,
} from "types/entities";
import {
  InvalidIDError,
  isValidArchiveId,
  isNonEmpty,
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
}: {
  workId: string | number;
}): Promise<WorkSummary | LockedWorkSummary> => {
  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }

  const workPage = await loadWorkPage({ workId });
  return getWorkDetails(workPage, workId);
};

// Gets the details of a work from a work page. This is used by getWork 
// and getWorkContent, which both load a work page and share this same data.
const getWorkDetails = (
  workPage: WorkPage,
  workId: string | number,
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
  // Anonymous works have a single author with `anonymous: true`, like everywhere else
  authors: Author[];
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

type GetWorkContentOptions =
  | {
    workId: string | number;
    chapterId?: string | number | null;
    fullWork?: false;
  }
  | {
    workId: string | number;
    chapterId?: null;
    // Return every chapter instead of the one AO3 shows by default.
    // Cannot coexist with chapterId, since AO3 doesn't show a full work
    // page for a single chapter.
    fullWork: true;
  };

export const getWorkContent = async ({
  workId,
  chapterId = null,
  fullWork = false,
}: GetWorkContentOptions): Promise<WorkWithText | LockedWorkSummary> => {
  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }
  if (!isValidArchiveIdOrNullish(chapterId)) {
    throw new InvalidIDError(chapterId, "chapter");
  }

  const workPage = await loadWorkPage({
    workId,
    chapterId: chapterId ?? undefined,
    fullWork,
  });
  const work = getWorkDetails(workPage, workId);
  // A locked work's page has no text or notes to read
  if (work.locked) {
    return work;
  }

  return {
    ...work,
    content: {
      notes: getWorkLevelNotes(workPage),
      chapters: fullWork
        ? getFullWorkChapters(workPage, work.id)
        : [getPageChapter(workPage, { workId: work.id, chapterId })],
    },
  };
};

// The one chapter a work or chapter page shows.
//
// When the requested chapter isn't part of the work, AO3 redirects to the
// work's first chapter instead of failing, so this throws rather than
// returning the wrong chapter.
const getPageChapter = (
  workPage: WorkPage,
  { workId, chapterId }: { workId: ArchiveId; chapterId: string | number | null },
): ChapterText => {
  // AO3 only shows the chapter's id for works with more than one chapter (or
  // an unknown number), so it's null for works with a single chapter.
  const pageChapterId = getMultiChapterId(workPage);
  if (chapterId !== null && pageChapterId !== parseArchiveId(chapterId)) {
    throw new Error(
      `Chapter ${chapterId} was not found: AO3 showed ${pageChapterId === null ? "the work" : `chapter ${pageChapterId}`} instead`,
    );
  }
  return getChapterText(workPage, {
    workId,
    index: pageChapterId === null ? 1 : getChapterIndex(workPage),
  });
};

// Reads one chapter's text from a page that shows only that chapter: a
// chapter page, or one chapter cut out of a full work page.
const getChapterText = (
  chapterPage: WorkPage,
  { workId, index }: { workId: ArchiveId; index: number },
): ChapterText => {
  const id = getMultiChapterId(chapterPage);
  const url = getWorkUrl({ workId, chapterId: id ?? undefined });
  return {
    id,
    url,
    shortUrl: getAsShortUrl({ url }),
    index,
    title: getChapterName(chapterPage),
    summary: getChapterSummary(chapterPage),
    notes: {
      start: getChapterStartNotes(chapterPage),
      end: getChapterEndNotes(chapterPage),
    },
    html: getWorkContentBody(chapterPage),
  };
};

const getFullWorkChapters = (
  workPage: WorkPage,
  workId: ArchiveId,
): WorkText["chapters"] => {
  const chapters = workPage("#chapters > .chapter")
    .toArray()
    .map((chapterElement, position) =>
      getChapterText(
        loadFullWorkChapter(workPage(chapterElement).prop("outerHTML") ?? ""),
        { workId, index: position + 1 },
      ),
    );

  // Single-chapter works render their text straight inside #chapters,
  // with no per-chapter preface.
  return isNonEmpty(chapters)
    ? chapters
    : [getChapterText(workPage, { workId, index: 1 })];
};
