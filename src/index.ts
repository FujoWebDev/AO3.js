import { Tag, User } from "./types/entities";
import { Work, getWorkLocked, getWorkPage } from "./utils/works";
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
  getProfileBookmarks,
  getProfileCollections,
  getProfileEmail,
  getProfileGifts,
  getProfileHeader,
  getProfileID,
  getProfileJoined,
  getProfileLink,
  getProfileLocation,
  getProfileName,
  getProfilePic,
  getProfilePseuds,
  getProfileSeries,
  getProfileWorks,
} from "./utils/user";
import { getTagId, getTagTagWorksPage } from "./utils/tag-works";

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await getTagPage(tagName);
  const TagTagWorksPage = await getTagTagWorksPage(tagName);

  return {
    name: tagName,
    id: getTagId(TagTagWorksPage),
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
  username,
}: {
  username: string;
}): Promise<User> => {
  const profilePage = await getProfile(username);

  return {
    // We use this because capitalization might be different
    username: getProfileName(profilePage),
    // TODO: this should really be an array
    pseuds: getProfilePseuds(profilePage),
    id: getProfileID(profilePage),
    joined: getProfileJoined(profilePage),
    icon: getProfilePic(profilePage),
    header: getProfileHeader(profilePage),
    email: getProfileEmail(profilePage),
    location: getProfileLocation(profilePage),
    birthday: getProfileBday(profilePage),
    url: getProfileLink(username),
    works: getProfileWorks(profilePage),
    series: getProfileSeries(profilePage),
    bookmarks: getProfileBookmarks(profilePage),
    collections: getProfileCollections(profilePage),
    gifts: getProfileGifts(profilePage),
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

export const getWork = async ({
  workId,
}: {
  workId: string;
}): Promise<Work> => {
  const workPage = await getWorkPage({ workId });

  return {
    locked: getWorkLocked(workPage),
  };
};
