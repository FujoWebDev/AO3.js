import cheerio, { CheerioAPI } from "cheerio";

import { UserProfile } from "../types/pages";
import axios from "axios";

//Dates are ten characters long in the following format:
const DATE_FORMAT = "0000-00-00";
//Constants for trimming the navigation menu content
const STAT_SUFFIX = ")";
const WORKS_PREFIX = "Works (";
const SERIES_PREFIX = "Series (";
const BOOKMARKS_PREFIX = "Bookmarks (";
const COLLECTIONS_PREFIX = "Collections (";
const GIFTS_PREFIX = "Gifts (";

export const getProfileLink = (userName: string) =>
  `https://archiveofourown.org/users/${encodeURI(userName)}/profile`;

export const getProfile = async (userName: string) => {
  return cheerio.load(
    (await axios.get<string>(getProfileLink(userName))).data
  ) as UserProfile;
};

export const getProfileName = ($userProfile: UserProfile) => {
  return $userProfile(".user.profile .header h2").text().trim();
};

//Trim punctuation; this allows us to remove the ", " between pseuds.
const PSEUD_SUFFIX = ", ";
export const getProfilePseuds = ($userProfile: UserProfile) => {
  const pseuds = $userProfile("dd.pseuds").text().concat(", ");
  return pseuds.slice(0, -PSEUD_SUFFIX.length);
};

//Trim the results to only the date:
export const getProfileJoined = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email, .location, .birthday, .pseuds)"
  ).text();
  return dds.slice(0, DATE_FORMAT.length);
};

//Trim the results to only content after the date:
export const getProfileID = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email):not(dt.location+dd):not(.birthday):not(.pseuds)"
  ).text();
  return dds.slice(DATE_FORMAT.length);
};

export const getProfilePic = ($userProfile: UserProfile) => {
  const profilePic = $userProfile("img.icon").attr("src");
  if (!profilePic) {
    throw new Error("Users must have profile pic. Something is wrong.");
  }
  return profilePic;
};

export const getProfileHeader = ($userProfile: UserProfile) => {
  return $userProfile("div.user.home.profile > h3.heading").text().trim();
};

export const getProfileBio = ($userProfile: UserProfile) => {
  return $userProfile(".bio .userstuff").html();
};

export const getProfileEmail = ($userProfile: UserProfile) => {
  return $userProfile("dd.email").text();
};

export const getProfileLocation = ($userProfile: UserProfile) => {
  return $userProfile("dt.location+dd").text();
};

export const getProfileBday = ($userProfile: UserProfile) => {
  return $userProfile("dd.birthday").text();
};

export const getProfileWorks = ($userProfile: UserProfile) => {
  return $userProfile("#dashboard a[href$='works']")
    .text()
    .trim()
    .slice(WORKS_PREFIX.length, -STAT_SUFFIX.length);
};

export const getProfileSeries = ($userProfile: UserProfile) => {
  return $userProfile("#dashboard a[href$='series']")
    .text()
    .trim()
    .slice(SERIES_PREFIX.length, -STAT_SUFFIX.length);
};

export const getProfileBookmarks = ($userProfile: UserProfile) => {
  return $userProfile("#dashboard a[href$='bookmarks']")
    .text()
    .trim()
    .slice(BOOKMARKS_PREFIX.length, -STAT_SUFFIX.length);
};

export const getProfileCollections = ($userProfile: UserProfile) => {
  return $userProfile("#dashboard a[href$='collections']")
    .text()
    .trim()
    .slice(COLLECTIONS_PREFIX.length, -STAT_SUFFIX.length);
};

export const getProfileGifts = ($userProfile: UserProfile) => {
  return $userProfile("#dashboard a[href$='gifts']")
    .text()
    .trim()
    .slice(GIFTS_PREFIX.length, -STAT_SUFFIX.length);
};
