import {
  InvalidIDError,
  isValidArchiveId,
  isValidArchiveIdOrNullish,
  parseArchiveId,
} from "./utils";
import {
  Author,
  TagSearchFilters,
  UserWorksFilters,
  WorkSummary,
} from "types/entities";

declare global {
  var archiveBaseUrl: string;
}

const DEFAULT_BASE_URL =
  import.meta.env?.ARCHIVE_BASE_URL ?? "https://archiveofourown.org";

globalThis.archiveBaseUrl = DEFAULT_BASE_URL;

export const setArchiveBaseUrl = (url: string) => {
  globalThis.archiveBaseUrl = url;
};

export const getArchiveBaseUrl = () => {
  return globalThis.archiveBaseUrl;
};

export const resetArchiveBaseUrl = () => {
  globalThis.archiveBaseUrl = DEFAULT_BASE_URL;
};

export const getWorkUrl = ({
  workId,
  chapterId,
  collectionName,
}: {
  workId: string | number;
  chapterId?: string | number;
  collectionName?: string;
}) => {
  let workPath = "";

  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }

  if (collectionName) {
    // TODO: write tests for collections
    workPath += `/collections/${collectionName}`;
  }

  workPath += `/works/${workId}`;

  if (chapterId) {
    if (!isValidArchiveId(chapterId)) {
      throw new InvalidIDError(workId, "chapter");
    }

    workPath += `/chapters/${chapterId}`;
  }

  return new URL(workPath, getArchiveBaseUrl()).href;
};

export const getWorkIndexUrl = ({ workId }: { workId: string | number }) => {
  if (!isValidArchiveId(workId)) {
    throw new InvalidIDError(workId, "work");
  }
  return new URL(`works/${workId}/navigate`, getArchiveBaseUrl()).href;
};

export const getSeriesUrl = ({ seriesId }: { seriesId: string | number }) => {
  if (!isValidArchiveId(seriesId)) {
    throw new InvalidIDError(seriesId, "series");
  }

  return new URL(`series/${seriesId}`, getArchiveBaseUrl()).href;
};

export const getAsShortUrl = ({ url }: { url: string | URL }) => {
  const longUrl = new URL(url);
  if (longUrl.hostname !== "archiveofourown.org") {
    throw new Error(
      `Short URLs are only supported for AO3 (found: ${longUrl.hostname})`,
    );
  }

  longUrl.host = "ao3.org";
  return longUrl.href;
};

/**
 * Gets the download URLs for a work.
 *
 * Warning: while this method will return the download URLs for locked works,
 * people may not be able to download them.
 */
export const getDownloadUrls = ({
  id,
  title,
  updatedAt,
  publishedAt,
}: // Make it so you can either pass specifically the needed elements of a work,
  // but also the whole summary if you prefer
  | Pick<WorkSummary, "id" | "title" | "updatedAt" | "publishedAt">
  | WorkSummary) => {
  const timestamp = new Date(updatedAt ?? publishedAt).valueOf();
  const downloadLinkBase = new URL(`downloads/${id}/`, getArchiveBaseUrl())
    .href;
  const urlSafeTitle = title.replaceAll(/\s/g, "_");

  return {
    azw3: `${downloadLinkBase}${urlSafeTitle}.azw3?updated_at=${timestamp}`,
    epub: `${downloadLinkBase}${urlSafeTitle}.epub?updated_at=${timestamp}`,
    mobi: `${downloadLinkBase}${urlSafeTitle}.mobi?updated_at=${timestamp}`,
    html: `${downloadLinkBase}${urlSafeTitle}.html?updated_at=${timestamp}`,
    pdf: `${downloadLinkBase}${urlSafeTitle}.pdf?updated_at=${timestamp}`,
  };
};

export const getUserProfileUrl = ({ username }: { username: string }) =>
  new URL(`/users/${encodeURIComponent(username)}/profile`, getArchiveBaseUrl()).href;

const USER_WORKS_SORT_COLUMNS: Record<UserWorksFilters["sortColumn"], string> = {
  authors: "authors_to_sort_on",
  title: "title_to_sort_on",
  created_at: "created_at",
  updated_at: "revised_at",
  word_count: "word_count",
  hits: "hits",
  kudos_count: "kudos_count",
  comments_count: "comments_count",
  bookmarks_count: "bookmarks_count",
};

export const getUserWorksUrl = ({
  username,
  pseud,
  page,
  sortColumn,
  sortDirection,
}: Partial<UserWorksFilters> & { username: string; pseud?: string }) => {
  // Pseud names are only unique within an account, so AO3 nests them under
  // each user.
  const userPath = `/users/${encodeURIComponent(username)}`;
  const url = new URL(
    pseud === undefined
      ? `${userPath}/works`
      : `${userPath}/pseuds/${encodeURIComponent(pseud)}/works`,
    getArchiveBaseUrl(),
  );

  if (page !== undefined) {
    url.searchParams.set("page", String(page));
  }
  if (sortColumn !== undefined) {
    url.searchParams.set(
      "work_search[sort_column]",
      USER_WORKS_SORT_COLUMNS[sortColumn],
    );
  }
  if (sortDirection) {
    url.searchParams.set("work_search[sort_direction]", sortDirection);
  }

  return url.href;
};

const TOKEN_REPLACEMENTS_MAP = {
  "/": "*s*",
  "&": "*a*",
  ".": "*d*",
  "#": "*h*",
  "?": "*q*",
} as const;

type ReplaceableToken = keyof typeof TOKEN_REPLACEMENTS_MAP;

const REPLACEABLE_TOKENS = Object.keys(
  TOKEN_REPLACEMENTS_MAP,
) as ReplaceableToken[];

const TOKENS_TO_ESCAPE = ["/", "?", "."];

const shouldEscapeToken = (c: string) => TOKENS_TO_ESCAPE.includes(c);
const isReplaceableToken = (c: string): c is ReplaceableToken =>
  REPLACEABLE_TOKENS.includes(c as ReplaceableToken);

/**
 * A global regex that matches any of the replaceable tokens.
 * Should result in something like /(\/|\.|&|#|\?)/g.
 */
const REPLACE_TOKENS_REGEX = new RegExp(
  `(${REPLACEABLE_TOKENS.map((token) =>
    shouldEscapeToken(token) ? `\\${token}` : token,
  ).join("|")})`,
  "g",
);

export const getTagUrl = (tagName: string) =>
  new URL(
    `tags/${encodeURIComponent(tagName.replaceAll(
      REPLACE_TOKENS_REGEX,
      (char: string) =>
        isReplaceableToken(char) ? TOKEN_REPLACEMENTS_MAP[char] : char,
    ))}/`,
    getArchiveBaseUrl(),
  ).href;

export const getTagWorksFeedUrl = (tagName: string) =>
  new URL(`works`, getTagUrl(tagName)).href;

export const getTagWorksFeedAtomUrl = (tagId: string) =>
  new URL(`tags/${tagId}/feed.atom`, getArchiveBaseUrl()).href;

/**
 * Reads the username (and pseud, if any) from a user URL.
 *
 * The username is returned exactly as it appears in the URL. AO3 matches
 * usernames in any letter case (e.g. /users/franzeska loads the account
 * "Franzeska"), so usernames from user-given links may not match the ones
 * in AO3's own author links. Make sure to use .toLowerCase() when comparing
 * them.
 */
export const getUserDetailsFromUrl = ({
  url,
}: {
  url: string;
}): {
  username: string;
  pseud?: string;
} => {
  const match = url.match(/\/users\/([^/?#]+)(?:\/pseuds\/([^/?#]+))?/);
  if (!match) {
    throw new Error(`Invalid user URL: ${url}`);
  }

  // Without a pseud the URL points to the whole account, not to the
  // user's default pseud (which can have a different name).
  const [, username, pseud] = match;
  return pseud === undefined
    ? { username }
    : { username, pseud: decodeURI(pseud) };
};

export const getAuthorFromUrl = ({ url }: { url: string }): Author => {
  const { username, pseud } = getUserDetailsFromUrl({ url });
  if (pseud === undefined) {
    throw new Error(`Unexpected author URL: ${url}`);
  }

  return { username, pseud, anonymous: false };
};

export const getWorkDetailsFromUrl = ({
  url,
}: {
  url: string;
}): {
  workId: number;
  chapterId?: number;
  collectionName?: string;
} => {
  const workUrlMatch = url.match(/works\/(\d+)/);
  if (!workUrlMatch) {
    throw new Error("Invalid work URL");
  }

  const matchedWorkId = workUrlMatch[1];
  const matchedChapterId = url.match(/chapters\/(\d+)/)?.[1];
  if (!isValidArchiveId(matchedWorkId)) {
    throw new InvalidIDError(matchedWorkId, "work");
  }

  if (!isValidArchiveIdOrNullish(matchedChapterId)) {
    throw new InvalidIDError(matchedChapterId, "chapter");
  }

  return {
    workId: parseArchiveId(matchedWorkId),
    chapterId: matchedChapterId && parseArchiveId(matchedChapterId),
    collectionName: url.match(/collections\/(\w+)/)?.[1],
  };
};

const getSearchParamsFromTagFilters = (
  searchFilters: Partial<TagSearchFilters>,
) => {
  // Prepare the parameters for the search as a map first. This makes them a bit
  // more readable, since these parameters will all need to be wrapped with with
  // "tag_search[]" in the URL.
  const parameters = {
    name: searchFilters.tagName ?? "",
    fandoms: searchFilters.fandoms?.join(",") ?? "",
    // AO3 requires an empty string for "any" type
    // This is not the same for wrangling_status, somehow
    type:
      searchFilters.type && searchFilters.type !== "any"
        ? searchFilters.type.charAt(0).toUpperCase() +
        searchFilters.type.slice(1).toLowerCase()
        : "",
    wrangling_status:
      searchFilters.wranglingStatus
        // We remove the _or_ and _and_ that we added for readability
        // so that the values match the expected values for the API.
        ?.replaceAll("_or_", "_")
        .replaceAll("_and_", "_") ?? "any",
    sort_column:
      searchFilters.sortColumn === "works_count"
        ? "uses"
        : (searchFilters.sortColumn ?? "name"),
    sort_direction: searchFilters.sortDirection ?? "asc",
  };

  const searchParams = new URLSearchParams();
  if (searchFilters.page) {
    searchParams.set("page", String(searchFilters.page));
  }
  searchParams.set("commit", "Search Tags");

  // Now add the parameters to the search params, wrapped with "tag_search[]"
  for (const [key, value] of Object.entries(parameters)) {
    searchParams.set(`tag_search[${key}]`, value);
  }

  return searchParams;
};

export const getSearchUrlFromTagFilters = (searchFilters: TagSearchFilters) => {
  const url = new URL(`tags/search`, getArchiveBaseUrl());
  url.search = getSearchParamsFromTagFilters(searchFilters).toString();
  return url.href;
};
