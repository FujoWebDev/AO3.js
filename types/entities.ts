export type ArchiveId = number;

export type TagCategory =
  | "fandom"
  | "character"
  | "relationship"
  | "archive warning"
  | "additional tags";

export interface Tag {
  name: string;
  // Every tag has an ID on AO3, but it's only exposed (via the tag's RSS link) for Fandom, Character
  // and Relationship tags.
  // Synned tags return their canonical's ID, because AO3 redirects their works page to the
  // canonical's. Unwrangled tags are always null.
  // TODO: when logged in, the "Favorite Tag" form exposes the ID of any canonical tag. Unsure what to
  // do with that yet.
  id: ArchiveId | null;
  category: TagCategory;
  canonical: boolean;
  common: boolean;
  // Canonical name will be the same as "name" on canonical tags, and different on tags
  // that have been synned to a canonical. It will be null when tags haven't been marked as
  // common and cannot be filtered on.
  canonicalName: string | null;
  parentTags: string[];
  childTags: Array<{
    tagName: string;
    category: TagCategory;
  }>;
  subTags: Array<{
    tagName: string;
    parentSubTag: string | null;
  }>;
  tagsWithSameMeaning: string[];
}

export type TagSearchType =
  | "fandom"
  | "character"
  | "relationship"
  | "freeform"
  | "any";

export type TagWranglingStatus =
  | "canonical"
  | "noncanonical"
  | "synonymous"
  | "canonical_or_synonymous"
  | "noncanonical_and_nonsynonymous"
  | "any";

export interface TagSearchFilters {
  tagName: string | null;
  fandoms: string[];
  type: TagSearchType;
  wranglingStatus: TagWranglingStatus;
  sortColumn: "name" | "created_at" | "works_count";
  sortDirection: "asc" | "desc";
  page: number;
}

export interface TagSearchResultSummary {
  filters: TagSearchFilters;
  totalResults: number;
  pages: {
    total: number;
    current: number;
  };
  tags: Array<{
    name: string;
    type: "fandom" | "character" | "relationship" | "freeform" | "unsorted";
    canonical: boolean;
    worksCount: number;
  }>;
}

export interface User {
  id: ArchiveId;
  username: string;
  pseuds: string;
  url: string;
  shortUrl: string | null;
  icon: string;
  header: string | null;
  joined: string;
  location: string | null;
  birthday: string | null;
  works: number;
  series: number;
  bookmarks: number;
  collections: number;
  gifts: number;
  bioHtml: string | null;
}

export interface UserWorksFilters {
  sortColumn:
  | "authors"
  | "title"
  | "created_at"
  | "updated_at"
  | "word_count"
  | "hits"
  | "kudos_count"
  | "comments_count"
  | "bookmarks_count";
  sortDirection: "asc" | "desc";
  page: number;
}

export interface UserWorks {
  filters: UserWorksFilters;
  totalResults: number;
  pages: {
    total: number;
    current: number;
  };
  works: WorkBlurbSummary[];
}

// A work as AO3 shows it in listings like series and user works pages.
export interface WorkBlurbSummary
  extends Omit<
    WorkSummary,
    | "category"
    | "publishedAt"
    | "rating"
    | "tags"
    | "stats"
    | "locked"
    | "chapterInfo"
    | "series"
  > {
  url: string;
  shortUrl: string | null;
  tags: Omit<WorkSummary["tags"], "warnings">;
  stats: Omit<WorkSummary["stats"], "comments">;
}

/** @deprecated Use `WorkBlurbSummary` instead. */
export type SeriesWorkSummary = WorkBlurbSummary;

export interface Series {
  id: ArchiveId;
  name: string;
  startedAt: string;
  updatedAt: string;
  authors: WorkSummary["authors"];
  description: string | null;
  notes: string | null;
  words: number;
  bookmarks: number;
  complete: boolean;
  workCount: number;
  pages: {
    total: number;
    current: number;
  };
  works: WorkBlurbSummary[];
}

export enum WorkRatings {
  NOT_RATED = "Not Rated",
  GENERAL_AUDIENCES = "General Audiences",
  TEEN_AND_UP_AUDIENCES = "Teen And Up Audiences",
  MATURE = "Mature",
  EXPLICIT = "Explicit",
}

export enum WorkCategory {
  FF = "F/F",
  FM = "F/M",
  GEN = "Gen",
  MM = "M/M",
  MULTI = "Multi",
  OTHER = "Other",
}

export enum WorkWarningStatus {
  NO_WARNINGS_APPLY = "Author indicated no warnings apply",
  CHOOSE_NOT_TO_WARN = "Author chose not to warn",
  EXTERNAL = "External work",
  HAS_WARNING = "Work has one or more warning",
}

export enum WorkWarnings {
  GRAPHIC_VIOLENCE = "Graphic Depictions Of Violence",
  MAJOR_CHARACTER_DEATH = "Major Character Death",
  NO_WARNINGS_APPLY = "No Archive Warnings Apply",
  NONCON = "Rape/Non-Con",
  UNDERAGE = "Underage Sex",
  CHOOSE_NOT_TO_WARN = "Creator Chose Not To Use Archive Warnings",
}

export interface BasicSeries {
  id: ArchiveId;
  index: number;
  name: string;
}

export interface Author {
  username: string;
  pseud: string;
  anonymous: boolean;
}

export interface WorkSummary {
  id: ArchiveId;
  source: "website";
  // e.g. "archiveofourown.org", or a mirror set through setArchiveBaseUrl
  host: string;
  title: string;
  category: WorkCategory[] | null;
  // Date in ISO format. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  // Note that AO3 doesn't publish the actual time of publish, just the date.
  publishedAt: string;
  updatedAt: string | null;
  // The work's summary, as AO3 shows it. This is HTML, not plain text.
  summary: string | null;
  rating: WorkRatings;
  // Whether this work would display the "this work could have adult content" banner
  // upon access.
  adult: boolean;
  fandoms: string[];
  tags: {
    warnings: WorkWarnings[];
    characters: string[];
    relationships: string[];
    additional: string[];
  };
  // If the author is anonymous this array will contain a single
  // entry whose "anonymous" property is "true".
  authors: Author[];
  language: string;
  words: number;
  chapters: {
    published: number;
    total: number | null;
  };
  chapterInfo: {
    id: ArchiveId;
    index: number;
    name: string | null;
    summary: string | null;
  } | null;
  series: BasicSeries[];
  complete: boolean;
  stats: {
    bookmarks: number;
    comments: number;
    kudos: number;
    hits: number;
  };
  locked: false;
}

// The notes before and after a work or chapter
export interface ContentNotes {
  start: string | null;
  end: string | null;
}

export interface Chapter {
  id: ArchiveId;
  workId: ArchiveId;
  index: number;
  title: string | null;
  publishedAt: string;
  url: string;
  shortUrl: string | null;
}

// One chapter's text and notes. Used both for works fetched from AO3 and for
// works read from a downloaded file.
export interface ChapterText {
  // Null when AO3 doesn't show the chapter's id: works with a single chapter,
  // and every chapter of a downloaded work
  id: ArchiveId | null;
  index: number;
  title: string | null;
  summary: string | null;
  notes: ContentNotes;
  html: string;
}

export interface ChapterPageContent {
  // The work's notes, when this page shows them: AO3 shows the start notes
  // on the first chapter and the end notes on the last. Works with a single
  // chapter only have these, never chapter notes.
  notes: ContentNotes;
  // The chapter this page shows. Its id, index, and title are in the work's
  // chapterInfo.
  chapter: Pick<ChapterText, "summary" | "notes" | "html">;
}

export interface DownloadedChapter extends ChapterText {
  id: null;
}

// Work content. Every text field (summaries, notes, chapter text) is HTML: use
// toPlainText for the text without markup.
//
// There's a lot of overlapping but slightly different types for work content,
// because AO3 shows different content depending on whether you're looking at a
// work's page, a chapter's page, or the full work.
// 
// The types are: 
//   - getWorkContent() ⇒ WorkContentChapter ⇒ { ...WorkSummary, content: { notes, chapter } } 
//   - getWorkContent({ fullWork: true }) ⇒ WorkContentFull ⇒ { ...WorkSummary, content: { notes, chapters } } 
//   - parseEpubWork() / parsePdfWork() ⇒ DownloadedWork  ⇒ { ...file details, content: { notes, chapters } }
// 
//   If a work is locked, it will be a LockedWorkSummary ⇒ { id, source, host, locked: true }
//
// To tell them apart check `locked` first, then `source` ("website" or "file").
// A single chapter's page has `content.chapter`, a whole work has
// `content.chapters`.

export interface WorkContentChapter extends WorkSummary {
  content: ChapterPageContent;
}

// Works read from a file downloaded from AO3 don't include the
// work's series or chapter ids, and their `stats` are always null.
export interface DownloadedWork
  extends Pick<
    WorkSummary,
    | "id"
    | "title"
    | "authors"
    | "rating"
    | "category"
    | "fandoms"
    | "tags"
    | "language"
    | "summary"
    | "publishedAt"
    | "updatedAt"
    | "words"
    | "chapters"
    | "complete"
    | "adult"
  > {
  url: string;
  shortUrl: string | null;
  source: "file";
  file: {
    format: "epub" | "pdf";
    // The path the caller passed in, since the parsers only see the file's bytes.
    // null when none was given.
    filePath: string | null;
  };
  // Downloads don't include kudos, hits, or bookmarks. Works fetched from AO3
  // have `stats`, so this is always null here: code handling both kinds can
  // check `work.stats` without checking `source` first.
  stats: null;
  content: {
    notes: ContentNotes;
    chapters: DownloadedChapter[];
  };
}

export interface LockedWorkSummary extends Pick<WorkSummary, "id" | "source" | "host"> {
  locked: true;
}

