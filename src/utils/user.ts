import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}

export type UserName = string;
export type UserPseuds = string;
export type UserJoined = string;
export type UserID = string;

export const getProfileLink = (userName: string) =>
  `https://archiveofourown.org/users/${encodeURI(userName)}/profile`;

export const getProfile = async (userName: string) => {
  return cheerio.load(
    (await axios.get<string>(getProfileLink(userName))).data
  ) as UserProfile;
};

export const getProfileName = ($userProfile: UserProfile): UserName => {
 return $userProfile(".user.profile .header h2").text() as UserName;
}

export const getProfilePseuds = ($userProfile: UserProfile): UserPseuds => {
 return $userProfile("dd.pseuds").text() as UserPseuds;
}

export const getProfileJoined = ($userProfile: UserProfile): UserJoined => {
 return $userProfile(".meta dd:first-child:not(.pseuds)").text() as UserJoined;
}

export const getProfileID = ($userProfile: UserProfile): UserID => {
 return $userProfile(".meta dd:last-child)").text() as UserID;
}

//TODO: Pull information (Works/Series/Bookmarks/Collections/Gifts) from navigation actions maybe 