export type TagCategory =
  | "fandom"
  | "character"
  | "relationship"
  | "archive warning"
  | "additional tags";

export interface Tag {
  name: string;
  // Not all tags have user-facing IDs Example: additional tags.
  // TODO: figure out other types (or whether they can be extracted from somewhere else).
  id: string | null;
  category: TagCategory;
  canonical: boolean;
  common: boolean;
  // Canonical name will be the same as "name" on canonical tags, and different on tags
  // that have been synned to a canonical. It will be null when tags haven't been marked as
  // common and cannot be filtered on.
  canonicalName: string | null;
}

export interface User {
  id: string;
  username: string;
  pseuds: string;
  url: string;
  icon: string;
  header: string | null;
  joined: string;
  location: string | null;
  email: string | null;
  birthday: string | null;
  works: number;
  series: number;
  bookmarks: number;
  collections: number;
  gifts: number;
  bioHtml: string | null;
}

export interface SeriesWorkSummary
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
  tags: Omit<WorkSummary["tags"], "warnings">;
  stats: Omit<WorkSummary["stats"], "comments">;
}

export interface Series {
  id: string;
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
  works: SeriesWorkSummary[];
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
  UNDERAGE = "Underage",
  CHOOSE_NOT_TO_WARN = "Creator Chose Not To Use Archive Warnings",
}

export interface BasicSeries {
  id: string;
  index: number;
  name: string;
}

export interface Author {
  username: string;
  pseud: string;
}

export interface WorkSummary {
  id: string;
  title: string;
  category: WorkCategory[] | null;
  // Date in ISO format. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  // Note that AO3 doesn't publish the actual time of publish, just the date.
  publishedAt: string;
  updatedAt: string | null;
  // TODO: should this be in HTML?
  summary: string | null;
  rating: WorkRatings;
  // Whether this work will display the "this work could have adult content" banner
  // upon access.
  adult: boolean;
  fandoms: string[];
  tags: {
    warnings: WorkWarnings[];
    characters: string[];
    relationships: string[];
    additional: string[];
  };
  authors: "Anonymous" | Author[];
  language: string;
  words: number;
  chapters: {
    published: number;
    total: number | null;
  };
  chapterInfo: {
    id: string;
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

export interface LockedWorkSummary {
  locked: true;
}

export interface Chapter {
  id: string;
  workId: string;
  index: number;
  title: string;
  publishedAt: string;
  url: string;
}
