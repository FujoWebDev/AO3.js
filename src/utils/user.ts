import cheerio, { CheerioAPI } from "cheerio";

import { UserProfile } from "../types/pages";
import axios from "axios";

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
const PSEUD_AFTER = ", ";
export const getProfilePseuds = ($userProfile: UserProfile) => {
  const pseuds = $userProfile("dd.pseuds").text().concat(", ");
  return pseuds.slice(0, -PSEUD_AFTER.length);
};

//Dates are ten characters long in the following format:
const DATE_CONTENT = "0000-00-00";

//Trim the results to only the date:
export const getProfileJoined = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email, .location, .birthday, .pseuds)"
  ).text();
  return dds.slice(0, DATE_CONTENT.length);
};

//Trim the results to only content after the date:
export const getProfileID = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email):not(dt.location+dd):not(.birthday):not(.pseuds)"
  ).text();
  return dds.slice(DATE_CONTENT.length);
};

export const getProfilePic = ($userProfile: UserProfile) => {
  return $userProfile("img.icon").attr("src");
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

//TODO: Pull information (Works/Series/Bookmarks/Collections/Gifts) from navigation actions maybe?
