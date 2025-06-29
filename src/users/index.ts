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
    complete: '.iswip .text'
  }
  const numberKeys = ['kudos','comments','chapters','words','hits','bookmarks']
  const works = [];
  // unfortunately $userWorks(selector).map doesn't return an Array, it returns a Cheerio
  $userWorks(itemSelector).each((_i, el) => {
    const data = {};
    const $item = $userWorks(el);
    for (const [key, selector] of Object.entries(selectors)) {
      data[key] = numberKeys.includes(key) ? parseInt($item.find(selector).text(), 10) : $item.find(selector).text();
    }
    works.push(data);
  })

  return works
}

export const getUserWorks = async ({ username }: { username: string }): Promise<WorkSummary[]> => {
  const worksPage = await loadUserWorksList({ username });
  // parse current works page
  // check for next page
  // if next page
  // loop it
  // else return data
  return [];
}
