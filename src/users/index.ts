import {
  getBookmarksCount,
  getCollectionsCount,
  getGiftsCount,
  getSeriesCount,
  getTotalPages,
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
  getWorkCount,
} from "./getters";

import { User, UserWorks, WorkPreview } from "types/entities";
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
  const works: WorkPreview[] = [];
  // unfortunately $userWorks(selector).map doesn't return an Array, it returns a Cheerio
  $userWorks(itemSelector).each((_i, el) => {
    const data = {} as WorkPreview;
    const $item = $userWorks(el);
    /**
     * Parse into a number if it is a number data point
     * otherwise pass in the text
     */
    for (const [key, selector] of Object.entries(selectors)) {
      data[key] = numberKeys.includes(key) ? parseInt($item.find(selector).text(), 10) : $item.find(selector).text();
    }
    works.push(data as WorkPreview);
  })

  return works
}

export const getUserWorks = async ({ username, page = 0 }: { username: string, page?: number }): Promise<UserWorks> => {
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
