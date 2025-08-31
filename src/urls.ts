import { ID } from "types/entities";
import { parseId } from "./utils";

export const getWorkUrl = ({
  workId,
  chapterId,
  collectionName,
}: {
  workId: ID;
  chapterId?: ID;
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

export const getAsShortUrl = ({ url }: { url: string }) => url.replace(/archiveofourown/, 'ao3');

export const getUserProfileUrl = ({ username }: { username: string }) =>
  `https://archiveofourown.org/users/${encodeURI(username)}/profile`;

const tokenReplacerObject = {
  '/': '*s*',
  '&': '*a*',
  '.': '*d*',
  '#': '*h*',
  '?': '*q*'
}
const tokensToEscape = ['/', '?', '.']
const replaceEscapableTokens = (c:string) => tokensToEscape.includes(c) ? `\\${c}` : c;
const tagUrlReplaceChars = new RegExp(`(${Object.keys(tokenReplacerObject).map(replaceEscapableTokens).join('|')})`, 'g')///(\/|\.|&|#|\?)/g;

type ReplacerObjectKeys = keyof typeof tokenReplacerObject

export const getTagUrl = (tagName: string) =>
  `https://archiveofourown.org/tags/${encodeURI(tagName)
    .replaceAll(tagUrlReplaceChars, ($char:string) => tokenReplacerObject[$char as ReplacerObjectKeys] || $char)}`;

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
