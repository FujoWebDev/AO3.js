import { parseId } from "./utils";
import { WorkSummary, ID } from "types/entities";
import { getWork } from "./works";
import { getWorkTitle } from "./works/work-getters";

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

export const getDownloadUrls = async ({ workId }: { workId: string }) => {
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
