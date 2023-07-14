import {
  getUserProfile,
  getUserProfileBio,
  getUserProfileBirthday,
  getUserProfileBookmarks,
  getUserProfileCollections,
  getUserProfileEmail,
  getUserProfileGifts,
  getUserProfileHeader,
  getUserProfileId,
  getUserProfileJoined,
  getUserProfileLink,
  getUserProfileLocation,
  getUserProfileName,
  getUserProfilePic,
  getUserProfilePseuds,
  getUserProfileSeries,
  getUserProfileWorks,
} from "./getters";

import { User } from "../types/entities";

export const getUser = async ({
  username,
}: {
  username: string;
}): Promise<User> => {
  const profilePage = await getUserProfile({ username });

  return {
    // We use this because capitalization might be different
    username: getUserProfileName(profilePage),
    // TODO: this should really be an array
    pseuds: getUserProfilePseuds(profilePage),
    id: getUserProfileId(profilePage),
    joined: getUserProfileJoined(profilePage),
    icon: getUserProfilePic(profilePage),
    header: getUserProfileHeader(profilePage),
    email: getUserProfileEmail(profilePage),
    location: getUserProfileLocation(profilePage),
    birthday: getUserProfileBirthday(profilePage),
    url: getUserProfileLink({ username }),
    works: getUserProfileWorks(profilePage),
    series: getUserProfileSeries(profilePage),
    bookmarks: getUserProfileBookmarks(profilePage),
    collections: getUserProfileCollections(profilePage),
    gifts: getUserProfileGifts(profilePage),
    bioHtml: getUserProfileBio(profilePage),
  };
};
