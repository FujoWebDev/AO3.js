import { parseId } from "./utils";
import { WorkSummary, ArchiveId } from "types/entities";
import { getWork } from "./works";

export const getWorkUrl = ({
  workId,
  chapterId,
  collectionName,
}: {
  workId: ArchiveId;
  chapterId?: ArchiveId;
  collectionName?: string;
}) => {
  let workUrl = `https://archiveofourown.org`;

  if (collectionName) {
    workUrl += `/collections/${collectionName}`;
  }

  workUrl += `/works/${workId}`;

  if (chapterId) {
    workUrl += `/chapters/${chapterId}`;
  }

  return workUrl;
};

export const getAsShortUrl = ({ url }: { url: string }) =>
  url.replace(/archiveofourown/, "ao3");

export const getDownloadUrls = async ({ workId }: { workId: ArchiveId }) => {
  const work = await getWork({ workId });

  if (work.locked) {
    console.warn('Work is locked, might not be able to download')
  }

  const { title, updatedAt, publishedAt } = work as WorkSummary;
  const timestamp = (new Date(updatedAt ?? publishedAt)).valueOf();
  const downloadLinkBase = `https://archiveofourown.org/downloads/${workId}/${title.replaceAll(/\s/g, '_')}`;
  return {
    azw3: `${downloadLinkBase}.azw3?updated_at=${timestamp}`,
    epub: `${downloadLinkBase}.epub?updated_at=${timestamp}`,
    mobi: `${downloadLinkBase}.mobi?updated_at=${timestamp}`,
    html: `${downloadLinkBase}.html?updated_at=${timestamp}`,
    pdf: `${downloadLinkBase}.pdf?updated_at=${timestamp}`,
  }
}

export const getUserProfileUrl = ({ username }: { username: string }) =>
  `https://archiveofourown.org/users/${encodeURI(username)}/profile`;

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
  `https://archiveofourown.org/tags/${encodeURI(tagName).replaceAll(
    REPLACE_TOKENS_REGEX,
    (char: string) =>
      isReplaceableToken(char) ? TOKEN_REPLACEMENTS_MAP[char] : char
  )}`;

export const getTagWorksFeedUrl = (tagName: string) =>
  `${getTagUrl(tagName)}/works`;

export const getTagWorksFeedAtomUrl = (tagId: string) =>
  `https://archiveofourown.org/tags/${tagId}/feed.atom`;

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
