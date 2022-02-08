import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}

export type UserName = string;
//export type UserPseuds = string;
//export type UserJoined = string;
//export type UserID = string;
//export type UserBio = string;

export interface User {
 name: string;
 pseuds: string;
 url: string;
 id: string;
 joined: string;
 bio: string;
}

export const getProfileLink = (userName: string) =>
  `https://archiveofourown.org/users/${encodeURI(userName)}/profile`;

export const getProfile = async (userName: string) => {
  return cheerio.load(
    (await axios.get<string>(getProfileLink(userName))).data
  ) as UserProfile;
};

export const getProfileName = ($userProfile: UserProfile): UserName => {
 return $userProfile(".user.profile .header h2").text() as UserName;
} //seeing whether to use types like UserName or just leave it

export const getProfilePseuds = ($userProfile: UserProfile) => {
 return $userProfile("dd.pseuds").text();
}

export const getProfileJoined = ($userProfile: UserProfile) => {
 return $userProfile(".meta dd:first-child:not(.pseuds)").text();
}

export const getProfileID = ($userProfile: UserProfile) => {
 return $userProfile(".meta dd:last-child").text();
}

export const getProfileBio = ($userProfile: UserProfile) => {
 return $userProfile(".bio.module").html();
}

//TODO: Pull information (Works/Series/Bookmarks/Collections/Gifts) from navigation actions maybe 

