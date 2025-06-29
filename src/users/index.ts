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

import { User, WorkSummary } from "types/entities";
import { getUserProfileUrl } from "../urls";
import { loadUserProfilePage, loadUserWorksList, loadWorkPage } from "../page-loaders";

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

export const getUserWorks = async ({ username }: {username: string}): Promise<WorkSummary[]> => {
  const worksPage = await loadUserWorksList({ username });
  // parse current works page
  // check for next page
  // if next page
    // loop it
  // else return data
  return [];
}
