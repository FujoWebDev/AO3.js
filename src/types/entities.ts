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
  name: string;
  pseuds: string;
  url: string;
  joined: string;
  location: string | null;
  email: string | null;
  birthday: string | null;
  bioHtml: string | null;
}

export enum WorkRatings {
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
  CHOOSE_NOT_TO_WARN = "Author chose not to warn",
  EXTERNAL = "External work",
  HAS_WARNING = "Work has one or more warning",
}

export enum WorkWarnings {
  GRAPHIC_VIOLENCE = "Graphic depictions of violence",
  MAJOR_CHARACTER_DEATH = "Major character death",
  NONCON = "Rape/non-con",
  UNDERAGE = "underage sex",
}

export interface WorkSummary {
  title: string;
  category: WorkCategory | null;
  publishedAt: number;
  // TODO: should this be in HTML?
  summary: string;
  rating: WorkRatings | null;
  // TODO: is this the same as rating?
  adult: boolean;
  // TODO: can this be null?
  fandoms: string[];
  warningStatus: WorkWarningStatus;
  tags: {
    warnings: WorkWarnings[];
    relationships: string[];
    additional: string[];
  };
  // TODO: how do we represent orphaned works? Can author be null?
  author: {
    id: number;
    name: string;
  };
  language: string;
  words: number;
  chapters: {
    current: number;
    total: number | null;
    complete: boolean;
  };
  stats: {
    comments: number;
    kudos: number;
    hits: number;
  };
}
