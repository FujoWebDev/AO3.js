import {
  getUserProfileBio,
  getUserProfileBirthday,
  getUserProfileBookmarks,
  getUserProfileCollections,
  getUserProfileGifts,
  getUserProfileHeader,
  getUserProfileId,
  getUserProfileJoined,
  getUserProfileLocation,
  getUserProfileName,
  getUserProfilePic,
  getUserProfilePseuds,
  getUserProfileSeries,
  getUserProfileWorks,
} from "./getters";

import { User, WorkPreview, WorkSummary } from "types/entities";
import { getUserProfileUrl } from "../urls";
import { loadUserProfilePage, loadUserWorksList, loadWorkPage, UserWorksPage } from "../page-loaders";

export const getUser = async ({
  username,
}: {
  username: string;
}): Promise<User> => {
  const profilePage = await loadUserProfilePage({ username });

  return {
    // We use this because capitalization might be different
    username: getUserProfileName(profilePage),
    // TODO: this should really be an array
    pseuds: getUserProfilePseuds(profilePage),
    id: getUserProfileId(profilePage),
    joined: getUserProfileJoined(profilePage),
    icon: getUserProfilePic(profilePage),
    header: getUserProfileHeader(profilePage),
    location: getUserProfileLocation(profilePage),
    birthday: getUserProfileBirthday(profilePage),
    url: getUserProfileUrl({ username }),
    works: getUserProfileWorks(profilePage),
    series: getUserProfileSeries(profilePage),
    bookmarks: getUserProfileBookmarks(profilePage),
    collections: getUserProfileCollections(profilePage),
    gifts: getUserProfileGifts(profilePage),
    bioHtml: getUserProfileBio(profilePage),
  };
};

const parseUserWorksIntoObject = ($userWorks: UserWorksPage) => {
  /**
   * It's just easier for me to reason this way,
   * I can move this into a more correct file later
   */
  const itemSelector = '.index.work.group > li';
  const selectors = {
    kudos: '.kudos + .kudos a',
    comments: '.comments + .comments a',
    chapters: '.chapters + .chapters a',
    words: '.words + .words',
    hits: '.hits + .hits',
    bookmarks: '.bookmarks + .bookmarks a',
    title: '.heading a:first-child',
    fandom: '.fandoms a',
    category: '.category .text',
    rating: '.rating .text',
    warnings: '.warnings .tag',
    complete: '.iswip .text',
    datetime: '.header.module .datetime',
  }
  const numberKeys = ['kudos','comments','chapters','words','hits','bookmarks']
  const works = [];
  // unfortunately $userWorks(selector).map doesn't return an Array, it returns a Cheerio
  $userWorks(itemSelector).each((_i, el) => {
    const data = {};
    const $item = $userWorks(el);
    /**
     * Parse into a number if it is a number data point
     * otherwise pass in the text
     */
    for (const [key, selector] of Object.entries(selectors)) {
      data[key] = numberKeys.includes(key) ? parseInt($item.find(selector).text(), 10) : $item.find(selector).text();
    }
    works.push(data);
  })

  return works
}

interface GetUserWorks {
  username: string;
  // very unsure about name
  counts: {
    works: number;
    series: number;
    bookmarks: number;
    collections: number;
    gifts: number;
  }
  pageInfo: {
    currentPage: number;
    totalPages: number;
  }
  worksInPage: WorkPreview[];
}

const getTotalPages = ($page: UserWorksPage) => {
  const lastNumberPagination = $page('.pagination li:has(+ .next)');

  return parseInt(lastNumberPagination.text(), 10);
}

const getWorkCount = ($page: UserWorksPage) => {
  const worksNavItem = $page('.navigation.actions:nth-child(2) li:first-child');
  return parseInt(worksNavItem.text().replaceAll(/\D/g, ''), 10);
}

const getSeriesCount = ($page: UserWorksPage) => {
  const seriesNavItem = $page('.navigation.actions:nth-child(2) li:nth-child(3)');
  return parseInt(seriesNavItem.text().replaceAll(/\D/g, ''), 10);
}

const getBookmarksCount = ($page: UserWorksPage) => {
  const bookmarksNavItem = $page('.navigation.actions:nth-child(2) li:nth-child(4)');
  return parseInt(bookmarksNavItem.text().replaceAll(/\D/g, ''), 10);
}

const getCollectionsCount = ($page: UserWorksPage) => {
  const collectionsNavItem = $page('.navigation.actions:nth-child(2) li:last-child');
  return parseInt(collectionsNavItem.text().replaceAll(/\D/g, ''), 10);
}

const getGiftsCount = ($page: UserWorksPage) => {
  const giftsNavItem = $page('.navigation.actions:last-child li:last-child');
  return parseInt(giftsNavItem.text().replaceAll(/\D/g, ''), 10);
}

export const getUserWorks = async ({ username, page = 0 }: { username: string, page: number }): Promise<GetUserWorks> => {
  const worksPage = await loadUserWorksList({ username, page });
  // parse current works page
  // check for next page
  // if next page
  // loop it
  // else return data
  return {
    username,
    pageInfo: {
      currentPage: page,
      totalPages: getTotalPages(worksPage),
    },
    counts: {
      works: getWorkCount(worksPage),
      series: getSeriesCount(worksPage),
      bookmarks: getBookmarksCount(worksPage),
      collections: getCollectionsCount(worksPage),
      gifts: getGiftsCount(worksPage),
    },
    worksInPage: parseUserWorksIntoObject(worksPage)
  }
}
