import {
  WorkCategory,
  WorkWarnings,
  type WorkRatings,
  type Author,
  type DownloadedChapter,
  type DownloadedWork,
} from "types/entities";
import { getAsShortUrl, getAuthorFromUrl, getWorkDetailsFromUrl } from "src/urls";
import {
  ANONYMOUS_AUTHOR,
  isAdultRating,
  isWorkCategory,
  isWorkRating,
  isWorkWarning,
} from "src/works/work-getters";
import { isDefaultChapterTitle } from "src/works/chapter-getters";
import { AO3_LANGUAGES } from "src/languages";

/**
 * The unvalidated data in a download. Do not trust it...yet.
 */
export interface DownloadData {
  format: DownloadedWork["source"];
  // The links in the "Posted originally on the Archive of Our Own" line
  workUrls: string[];
  title: string;
  // "by pseud (username), username", without the "by"
  byline: string;
  // Each author's link, when the download has them (EPUBs do, PDFs don't)
  authorUrls: string[];
  rating: string | undefined;
  warnings: string[];
  categories: string[] | undefined;
  fandoms: string[];
  relationships: string[];
  characters: string[];
  additional: string[];
  // AO3's name for the language, from the preface ("Español")
  languageName: string | undefined;
  // AO3's code for the language ("es"), which EPUBs keep in their metadata
  languageCode: string | undefined;
  stats: string | undefined;
  summary: string | null;
  startNotes: string | null;
  // Each chapter's heading as printed, which becomes its title unless it's AO3's default
  chapters: (Omit<DownloadedChapter, "index" | "title"> & { heading: string })[];
  endNotes: string | null;
}

// The labels AO3 prints in a download's preface, singular or plural
// ("Fandom:" or "Fandoms:") depending on how many values they have
export const PREFACE_LABELS = {
  rating: ["Rating"],
  warnings: ["Archive Warning", "Archive Warnings"],
  categories: ["Category", "Categories"],
  fandoms: ["Fandom", "Fandoms"],
  relationships: ["Relationship", "Relationships"],
  characters: ["Character", "Characters"],
  additional: ["Additional Tag", "Additional Tags"],
  language: ["Language"],
  series: ["Series"],
  collections: ["Collection", "Collections"],
  stats: ["Stats"],
} as const;

export type PrefaceField = keyof typeof PREFACE_LABELS;

// Links that are safe to keep in HTML built from a download: web and email only
export const SAFE_LINK_SCHEME = /^(?:https?:|mailto:)/i;

// Tags AO3 renamed since older downloads were made, by their current name
const RENAMED_WARNINGS: Record<string, WorkWarnings> = {
  "Choose Not To Use Archive Warnings": WorkWarnings.CHOOSE_NOT_TO_WARN,
};

/**
 * Reads the "Stats:" line of a download. AO3 only prints "Chapters:" for works
 * with more than one chapter, or with an unknown number of chapters, so
 * `chapters` is null for works with a single chapter.
 */
const parseStats = (stats: string) => {
  const publishedAt = stats.match(/Published: (\S+)/)?.[1];
  const words = stats.match(/Words: ([\d,]+)/)?.[1];
  if (!publishedAt || !words) {
    return undefined;
  }
  const chapters = stats.match(/Chapters: (\d+)\/(\d+|\?)/);
  return {
    publishedAt,
    updatedAt: stats.match(/(?:Completed|Updated): (\S+)/)?.[1] ?? null,
    words: Number(words.replaceAll(",", "")),
    chapters: chapters
      ? {
        published: Number(chapters[1]),
        total: chapters[2] === "?" ? null : Number(chapters[2]),
      }
      : null,
  };
};

// Downloads give AO3's name for the language, or only its code for older
// EPUBs. Works fetched from AO3 have the name, so codes become names.
const getLanguage = (data: DownloadData, problems: string[]) => {
  if (data.languageName !== undefined) {
    if (Object.values(AO3_LANGUAGES).includes(data.languageName)) {
      return data.languageName;
    }
    problems.push(`Unknown language: ${data.languageName}`);
    return undefined;
  }
  if (data.languageCode !== undefined) {
    if (Object.hasOwn(AO3_LANGUAGES, data.languageCode)) {
      return AO3_LANGUAGES[data.languageCode];
    }
    problems.push(`Unknown language code: ${data.languageCode}`);
    return undefined;
  }
  problems.push("Missing language");
  return undefined;
};

const getAuthors = (
  data: DownloadData,
  problems: string[],
): Author[] | undefined => {
  if (data.authorUrls.length === 0) {
    if (data.byline === "Anonymous") {
      return [ANONYMOUS_AUTHOR];
    }
    // AO3 adds the username in parentheses only when the pseud is different
    return data.byline
      .split(",")
      .map((author) => author.trim())
      .filter((author) => author !== "")
      .map((author) => {
        const withUsername = author.match(/^(.+?) \((.+)\)$/);
        return withUsername
          ? { username: withUsername[2], pseud: withUsername[1], anonymous: false }
          : { username: author, pseud: author, anonymous: false };
      });
  }
  try {
    return data.authorUrls.map((url) => getAuthorFromUrl({ url }));
  } catch (error) {
    problems.push(String(error));
    return undefined;
  }
};

const getWorkId = (data: DownloadData, source: string) => {
  const workUrl = data.workUrls.find((url) => url.includes("/works/"));
  if (!workUrl) {
    throw new Error(`${source} doesn't look like a work downloaded from AO3`);
  }
  return getWorkDetailsFromUrl({ url: workUrl }).workId;
};

const getStats = (data: DownloadData, problems: string[]) => {
  const stats = data.stats === undefined ? undefined : parseStats(data.stats);
  if (!stats) {
    problems.push(`Couldn't read the "Stats:" list: ${data.stats ?? "(missing)"}`);
  }
  return stats;
};

const getRating = (
  data: DownloadData,
  problems: string[],
): WorkRatings | undefined => {
  if (data.rating !== undefined && isWorkRating(data.rating)) {
    return data.rating;
  }
  problems.push(`Unknown rating: ${data.rating ?? "(missing)"}`);
  return undefined;
};

// Null when the download has no "Categories:" line at all, as AO3 does
const getCategories = (
  data: DownloadData,
  problems: string[],
): WorkCategory[] | null => {
  if (data.categories === undefined) {
    return null;
  }
  const categories: WorkCategory[] = [];
  for (const category of data.categories) {
    if (isWorkCategory(category)) {
      categories.push(category);
    } else {
      problems.push(`Unknown category: ${category}`);
    }
  }
  return categories;
};

const getWarnings = (data: DownloadData, problems: string[]) => {
  const warnings: WorkWarnings[] = [];
  for (const name of data.warnings) {
    const warning = RENAMED_WARNINGS[name] ?? name;
    if (isWorkWarning(warning)) {
      warnings.push(warning);
    } else {
      problems.push(`Unknown warning: ${name}`);
    }
  }
  return warnings;
};

const checkRequired = (
  data: DownloadData,
  authors: Author[] | undefined,
  problems: string[],
) => {
  if (data.title === "") {
    problems.push("Missing title");
  }
  if (data.fandoms.length === 0) {
    problems.push("Missing fandoms");
  }
  if (authors?.length === 0) {
    problems.push("Missing authors");
  }
  if (data.chapters.length === 0) {
    problems.push("Missing chapters");
  }
};

const toChapters = (
  chapters: DownloadData["chapters"],
  isMultiChapter: boolean,
): DownloadedChapter[] =>
  chapters.map(({ heading, ...chapter }, position) => ({
    index: position + 1,
    // A work with a single chapter uses its own title as the heading
    title:
      !isMultiChapter || isDefaultChapterTitle(heading, position + 1)
        ? null
        : heading,
    ...chapter,
  }));

/**
 * Checks everything read from a download, and turns it into a work. Throws
 * with every problem found at once.
 */
export const toDownloadedWork = (data: DownloadData): DownloadedWork => {
  const source = data.format === "epub" ? "The EPUB" : "The PDF";
  const workId = getWorkId(data, source);

  const problems: string[] = [];
  const stats = getStats(data, problems);
  const rating = getRating(data, problems);
  const categories = getCategories(data, problems);
  const warnings = getWarnings(data, problems);
  const language = getLanguage(data, problems);
  const authors = getAuthors(data, problems);
  checkRequired(data, authors, problems);

  if (
    !stats ||
    rating === undefined ||
    !authors ||
    language === undefined ||
    problems.length > 0
  ) {
    throw new Error(`${source} isn't a valid AO3 download:\n- ${problems.join("\n- ")}`);
  }

  const chapterCount = data.chapters.length;
  // Downloads always link to AO3 itself, whatever archive base URL is set
  const url = `https://archiveofourown.org/works/${workId}`;
  const chapters = stats.chapters ?? { published: chapterCount, total: chapterCount };
  return {
    id: workId,
    source: data.format,
    title: data.title,
    url,
    shortUrl: getAsShortUrl({ url }),
    authors,
    rating,
    adult: isAdultRating(rating),
    category: categories,
    fandoms: data.fandoms,
    tags: {
      warnings,
      relationships: data.relationships,
      characters: data.characters,
      additional: data.additional,
    },
    language,
    summary: data.summary,
    publishedAt: stats.publishedAt,
    updatedAt: stats.updatedAt,
    words: stats.words,
    chapters,
    complete: chapters.published === chapters.total,
    content: {
      startNotes: data.startNotes,
      chapters: toChapters(data.chapters, stats.chapters !== null),
      endNotes: data.endNotes,
    },
  };
};
