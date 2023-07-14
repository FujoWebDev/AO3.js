import { LockedWorkSummary, Tag, User, WorkSummary } from "./types/entities";
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
  getProfileBio,
  getProfileBirthday,
  getProfileBookmarks,
  getProfileCollections,
  getProfileEmail,
  getProfileGifts,
  getProfileHeader,
  getProfileId,
  getProfileJoined,
  getProfileLink,
  getProfileLocation,
  getProfileName,
  getProfilePic,
  getProfilePseuds,
  getProfileSeries,
  getProfileWorks,
} from "./utils/user";
import {
  getTagId,
  getWorkAdditionalTags,
  getWorkAuthors,
  getWorkBookmarkCount,
  getWorkCategory,
  getWorkCharacters,
  getWorkCommentCount,
  getWorkFandoms,
  getWorkHits,
  getWorkKudosCount,
  getWorkLanguage,
  getWorkLocked,
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
} from "./utils/works";

import axios from "axios";
import { getWorksFeed } from "./utils/tag-works";

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
    id: getProfileId(profilePage),
    joined: getProfileJoined(profilePage),
    icon: getProfilePic(profilePage),
    header: getProfileHeader(profilePage),
    email: getProfileEmail(profilePage),
    location: getProfileLocation(profilePage),
    birthday: getProfileBirthday(profilePage),
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
}): Promise<WorkSummary | LockedWorkSummary> => {
  const workPage = await getWorkPage(workId);

  if (getWorkLocked(workPage)) {
    return {
      locked: true,
    };
  }

  const totalChapters = getWorkTotalChapters(workPage);
  const publishedChapters = getWorkPublishedChapters(workPage);
  return {
    id: workId,
    authors: getWorkAuthors(workPage),
    title: getWorkTitle(workPage),
    words: getWorkWordcount(workPage),
    language: getWorkLanguage(workPage),
    rating: getWorkRating(workPage),
    category: getWorkCategory(workPage),
    // TODO: figure out how to get this
    adult: false,
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
      published: publishedChapters,
      total: totalChapters,
    },
    complete: totalChapters !== null && totalChapters === publishedChapters,

    summary: getWorkSummary(workPage),
    stats: {
      bookmarks: getWorkBookmarkCount(workPage),
      comments: getWorkCommentCount(workPage),
      hits: getWorkHits(workPage),
      kudos: getWorkKudosCount(workPage),
    },
    locked: false,
  };
};
