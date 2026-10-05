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

import type {
  User,
  UserWorks,
  UserWorksFilters,
} from "types/entities";
import { getAsShortUrl, getUserProfileUrl } from "src/urls";
import { loadUserProfilePage, loadUserWorksPage } from "src/page-loaders";
import { getUserWorksBlurbs, getUserWorksTotalResults } from "./works-getters";
import { getWorkBlurb } from "src/works/blurb-getters";
import { getPagesCount } from "src/tags/search-getters";

export const getUser = async ({
  username,
}: {
  username: string;
}): Promise<User> => {
  const profilePage = await loadUserProfilePage({ username });
  const url = getUserProfileUrl({ username });
  const shortUrl = getAsShortUrl({ url });
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
    url,
    shortUrl,
    works: getUserProfileWorks(profilePage),
    series: getUserProfileSeries(profilePage),
    bookmarks: getUserProfileBookmarks(profilePage),
    collections: getUserProfileCollections(profilePage),
    gifts: getUserProfileGifts(profilePage),
    bioHtml: getUserProfileBio(profilePage),
  };
};

export const getUserWorks = async ({
  username,
  pseud,
  ...userWorksFilters
}: Partial<UserWorksFilters> & {
  username: string;
  pseud?: string;
}): Promise<UserWorks> => {

  const sortColumn = userWorksFilters.sortColumn ?? "updated_at";
  const defaultSortDirection = sortColumn === "authors" || sortColumn === "title"
    ? "asc"
    : "desc";
  const normalizedFilters: UserWorksFilters = {
    sortColumn,
    sortDirection:
      userWorksFilters.sortDirection ?? defaultSortDirection,
    page: userWorksFilters.page ?? 1,
  };

  const worksPage = await loadUserWorksPage({
    username,
    pseud,
    ...normalizedFilters,
    // We only send the direction when it was requested, so the URL matches
    // the one AO3 itself links to.
    sortDirection: userWorksFilters.sortDirection,
  });
  const blurbs = getUserWorksBlurbs(worksPage);

  return {
    // We return the filters as is because they are already normalized.
    filters: normalizedFilters,
    totalResults: getUserWorksTotalResults(worksPage),
    pages: {
      total:
        blurbs.length > 0
          ? Math.max(1, getPagesCount(worksPage))
          : 0,
      current: normalizedFilters.page,
    },
    works: blurbs.map(getWorkBlurb),
  };
};
