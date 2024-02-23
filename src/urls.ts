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

export const getUserProfileUrl = ({ username }: { username: string }) =>
  `https://archiveofourown.org/users/${encodeURI(username)}/profile`;

export const getTagUrl = (tagName: string) =>
  `https://archiveofourown.org/tags/${encodeURI(tagName)
    .replace("/", "*s*")
    .replace("&", "*a*")
    .replace(".", "*d*")}`;

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

//defining the form of the arguments and the output
export const TODODelete = ({url,}: {url: string;}): {
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


export const getPromptDetailsFromUrl = ({
  // defining the input structure, eg.
  // url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428"
  url, 
}: {
  url: string;
}): {
  //defining the form of the return value/output
  //collection name is the url name, not the Display Title
  promptId: string;
  collectionName: string
} => {//TODO will fail?
  const promptUrlMatch = url.match(/prompts\/(\d+)/);
  if (!promptUrlMatch) {
    throw new Error("Invalid prompt URL");
  }

  const collectionMatch = url.match(/collections\/(\w+)/);
  if (!collectionMatch) {
    throw new Error("Invalid prompt URL");
  }
  
  return {
    promptId: promptUrlMatch[1],
    collectionName: collectionMatch[1]
  };
};
