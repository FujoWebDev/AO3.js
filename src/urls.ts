export const getWorkUrl = ({
  workId,
  chapterId,
  collectionName,
}: {
  workId: string;
  chapterId?: string;
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

const tagUrlReplaceChars = /(\/|\.|&|#|\?)/g;

const replacerObject = {
  '/': 's',
  '&': 'a',
  '.': 'd',
  '#': 'h',
  '?': 'q'
}

export const getTagUrl = (tagName: string) =>
  `https://archiveofourown.org/tags/${encodeURI(tagName)
    .replaceAll(tagUrlReplaceChars, ($char:string) => $char in replacerObject ? `*${replacerObject[$char as keyof typeof replacerObject]}*` : $char)}`;

export const getTagWorksFeedUrl = (tagName: string) =>
  `${getTagUrl(tagName)}/works`;

export const getTagWorksFeedAtomUrl = (tagId: string) =>
  `https://archiveofourown.org/tags/${tagId}/feed.atom`;

export const getWorkDetailsFromUrl = ({
  url,
}: {
  url: string;
}): {
  workId: string;
  chapterId?: string;
  collectionName?: string;
} => {
  const workUrlMatch = url.match(/works\/(\d+)/);
  if (!workUrlMatch) {
    throw new Error("Invalid work URL");
  }

  return {
    workId: workUrlMatch[1],
    chapterId: url.match(/chapters\/(\d+)/)?.[1],
    collectionName: url.match(/collections\/(\w+)/)?.[1],
  };
};
