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
  getProfileID,
  getProfileJoined,
  getProfileLink,
  getProfileLocation,
  getProfileName,
  getProfilePseuds,
} from "./utils/user";
import {
  getTagId,
  getWorkAdditionalTags,
  getWorkAuthor,
  getWorkBookmarkCount,
  getWorkCategory,
  getWorkCharacters,
  getWorkCommentCount,
  getWorkFandoms,
  getWorkHits,
  getWorkKudosCount,
  getWorkLanguage,
  getWorkPage,
  getWorkPublishDate,
  getWorkPublishedChapters,
  getWorkRating,
  getWorkRelationships,
  getWorkSummary,
  getWorkTitle,
  getWorkTotalChapters,
  getWorkUpdateDate,
  getWorkWarnings,
  getWorkWordcount,
  getWorksFeed,
} from "./utils/works";

import axios from "axios";
import { setupCache } from "axios-cache-adapter";

axios.defaults.cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await getTagPage(tagName);
  const worksFeed = await getWorksFeed(tagName);

  return {
    name: tagName,
    id: getTagId(worksFeed),
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
  return {
    workId: url.match(/works\/(\d+)/)[1],
    chapterId: url.match(/chapters\/(\d+)/)?.[1],
    collectionName: url.match(/collections\/(\w+)/)?.[1],
  };
};

export const getWork = async ({ workId }: { workId: string }): Promise<any> => {
  const workPage = await getWorkPage(workId);

  return {
    id: workId,
    authors: getWorkAuthor(workPage),
    title: getWorkTitle(workPage),
    words: getWorkWordcount(workPage),
    language: getWorkLanguage(workPage),
    rating: getWorkRating(workPage),
    category: getWorkCategory(workPage),
    fandoms: getWorkFandoms(workPage),
    tags: {
      warnings: getWorkWarnings(workPage),
      characters: getWorkCharacters(workPage),
      relationships: getWorkRelationships(workPage),
      additional: getWorkAdditionalTags(workPage),
    },
    publishedAt: getWorkPublishDate(workPage),
    updatedAt: getWorkUpdateDate(workPage),
    chapters: {
      published: getWorkPublishedChapters(workPage),
      total: getWorkTotalChapters(workPage),
    },
    summary: getWorkSummary(workPage),
    stats: {
      bookmarks: getWorkBookmarkCount(workPage),
      comments: getWorkCommentCount(workPage),
      hits: getWorkHits(workPage),
      kudos: getWorkKudosCount(workPage),
    },
  };
};
