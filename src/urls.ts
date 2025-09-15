import { L } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import {
  isValidArchiveId,
  isValidArchiveIdOrNullish,
  parseArchiveId,
} from "./utils";
import { WorkSummary } from "types/entities";

declare global {
  var archiveBaseUrl: string;
}

const DEFAULT_BASE_URL =
  process.env.ARCHIVE_BASE_URL ?? "https://archiveofourown.org";

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
    throw new Error(`${workId} is not a valid work id`);
  }

  if (collectionName) {
    // TODO: write tests for collections
    workPath += `/collections/${collectionName}`;
  }

  workPath += `/works/${workId}`;

  if (chapterId) {
    if (!isValidArchiveId(chapterId)) {
      throw new Error(`${workId} is not a valid chapter id`);
    }

    workPath += `/chapters/${chapterId}`;
  }

  return new URL(workPath, getArchiveBaseUrl()).href;
};

export const getWorkIndexUrl = ({ workId }: { workId: string | number }) => {
  if (!isValidArchiveId(workId)) {
    throw new Error(`${workId} is not a valid work id`);
  }
  return new URL(`works/${workId}/navigate`, getArchiveBaseUrl()).href;
};

export const getSeriesUrl = ({ seriesId }: { seriesId: string | number }) => {
  if (!isValidArchiveId(seriesId)) {
    throw new Error(`${seriesId} is not a valid series id`);
  }

  return new URL(`series/${seriesId}`, getArchiveBaseUrl()).href;
};

export const getAsShortUrl = ({ url }: { url: string | URL }) => {
  const longUrl = new URL(url);
  if (longUrl.hostname !== "archiveofourown.org") {
    throw new Error(
      `Short URLs are only supported for AO3 (found: ${longUrl.hostname})`
    );
  }

  longUrl.host = "ao3.org";
  return longUrl;
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
  new URL(`/users/${encodeURI(username)}/profile`, getArchiveBaseUrl()).href;

const TOKEN_REPLACEMENTS_MAP = {
  "/": "*s*",
  "&": "*a*",
  ".": "*d*",
  "#": "*h*",
  "?": "*q*",
} as const;

type ReplaceableToken = keyof typeof TOKEN_REPLACEMENTS_MAP;

const REPLACEABLE_TOKENS = Object.keys(
  TOKEN_REPLACEMENTS_MAP
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
    shouldEscapeToken(token) ? `\\${token}` : token
  ).join("|")})`,
  "g"
);

export const getTagUrl = (tagName: string) =>
  new URL(
    `tags/${encodeURI(tagName).replaceAll(
      REPLACE_TOKENS_REGEX,
      (char: string) =>
        isReplaceableToken(char) ? TOKEN_REPLACEMENTS_MAP[char] : char
    )}/`,
    archiveBaseUrl
  ).href;

export const getTagWorksFeedUrl = (tagName: string) =>
  new URL(`works`, getTagUrl(tagName)).href;

export const getTagWorksFeedAtomUrl = (tagId: string) =>
  new URL(`tags/${tagId}/feed.atom`, getArchiveBaseUrl()).href;

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
    throw new Error(`${matchedWorkId} is not a valid work id`);
  }

  if (!isValidArchiveIdOrNullish(matchedChapterId)) {
    throw new Error(`${matchedChapterId} is not a valid chapter id`);
  }

  return {
    workId: parseArchiveId(matchedWorkId),
    chapterId: matchedChapterId && parseArchiveId(matchedChapterId),
    collectionName: url.match(/collections\/(\w+)/)?.[1],
  };
};
