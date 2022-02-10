import { Tag, User } from "./types/entities";
import {
  getCanonical,
  getTagCategory,
  getTagPage,
  isCanonical,
  isCommon,
} from "./utils/tags";
import { getFeedPage, getTagNameFromFeed } from "./utils/feed";
import {
  getProfile,
  getProfileBday,
  getProfileBio,
  getProfileEmail,
  getProfileHeader,
  getProfileID,
  getProfileJoined,
  getProfileLink,
  getProfileLocation,
  getProfileName,
  getProfilePic,
  getProfilePseuds,
} from "./utils/user";
import { getTagId, getWorksPage } from "./utils/works";

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await getTagPage(tagName);
  const worksPage = await getWorksPage(tagName);

  return {
    name: tagName,
    id: getTagId(worksPage),
    category: getTagCategory(tagPage),
    canonical: isCanonical(tagPage),
    common: isCommon(tagPage),
    canonicalName: getCanonical(tagPage),
  };
};

export const getTagNameById = async ({ tagId }: { tagId: string }) => {
  return getTagNameFromFeed(await getFeedPage({ tagId }));
};

export const getUser = async ({
  userName,
}: {
  userName: string;
}): Promise<User> => {
  const profilePage = await getProfile(userName);

  return {
    name: getProfileName(profilePage),
    pseuds: getProfilePseuds(profilePage),
    id: getProfileID(profilePage),
    joined: getProfileJoined(profilePage),
    icon: getProfilePic(profilePage),
    header: getProfileHeader(profilePage),
    email: getProfileEmail(profilePage),
    location: getProfileLocation(profilePage),
    birthday: getProfileBday(profilePage),
    url: getProfileLink(userName),
    bioHtml: getProfileBio(profilePage),
  };
};

// TODO: rename this something like "extractWorkDataFromUrl" to make it explicit
// that no network call is involved.
export const getWorkData = ({
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
