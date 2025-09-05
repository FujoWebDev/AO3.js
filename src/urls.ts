import { parseId } from "./utils";
import { WorkSummary, ArchiveId } from "types/entities";
import { getWork } from "./works";

declare global {
  var archiveBaseUrl: string;
}

const DEFAULT_BASE_URL =
  process.env.ARCHIVE_BASE_URL ?? "https://archiveofourown.org";

globalThis.archiveBaseUrl = DEFAULT_BASE_URL;

export const setArchiveBaseUrl = (url: string) => {
  globalThis.archiveBaseUrl = url;
};

export const getArchiveBaseUrl = (url: string) => {
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
  workId: ArchiveId;
  chapterId?: ArchiveId;
  collectionName?: string;
}) => {
  console.log(`Current base path ${globalThis.archiveBaseUrl}`);
  let workPath = "";

  if (collectionName) {
    // TODO: write tests for collections
    workPath += `/collections/${collectionName}`;
  }

  workPath += `/works/${workId}`;

  if (chapterId) {
    workPath += `/chapters/${chapterId}`;
  }

  return new URL(workPath, globalThis.archiveBaseUrl).href;
};

export const getWorkIndexUrl = ({ workId }: { workId: string }) => {
  return new URL(`works/${workId}/navigate`, globalThis.archiveBaseUrl).href;
};

export const getSeriesUrl = ({ seriesId }: { seriesId: string }) => {
  return new URL(`series/${seriesId}`, globalThis.archiveBaseUrl).href;
};

export const getAsShortUrl = ({ url }: { url: string }) => {
  if (!url.includes("archiveofourown")) {
    throw new Error("We only support short URLs for AO3");
  }
  return url.replace(/archiveofourown/, "ao3");
};

export const getDownloadUrls = async ({ workId }: { workId: ArchiveId }) => {
  const work = await getWork({ workId });

  if (work.locked) {
    console.warn("Work is locked, might not be able to download");
  }

  const { title, updatedAt, publishedAt } = work as WorkSummary;
  const timestamp = new Date(updatedAt ?? publishedAt).valueOf();
  const downloadLinkBase = new URL(
    `downloads/${workId}/${title.replaceAll(/\s/g, "_")}`,
    archiveBaseUrl
  );
  return {
    azw3: `${downloadLinkBase}.azw3?updated_at=${timestamp}`,
    epub: `${downloadLinkBase}.epub?updated_at=${timestamp}`,
    mobi: `${downloadLinkBase}.mobi?updated_at=${timestamp}`,
    html: `${downloadLinkBase}.html?updated_at=${timestamp}`,
    pdf: `${downloadLinkBase}.pdf?updated_at=${timestamp}`,
  };
};

export const getUserProfileUrl = ({ username }: { username: string }) =>
  new URL(`/users/${encodeURI(username)}/profile`, globalThis.archiveBaseUrl)
    .href;

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
  new URL(`tags/${tagId}/feed.atom`, globalThis.archiveBaseUrl).href;

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

  return {
    workId: parseId(workUrlMatch[1] as `${number}`),
    chapterId: parseId(url.match(/chapters\/(\d+)/)?.[1] as `${number}`),
    collectionName: url.match(/collections\/(\w+)/)?.[1],
  };
};
