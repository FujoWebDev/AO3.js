import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}

export interface User {
 id: string;
 name: string;
 pseuds: string;
 url: string;
 joined: string;
 bioHtml: string | null;
}

export const getProfileLink = (userName: string) =>
  `https://archiveofourown.org/users/${encodeURI(userName)}/profile`;

export const getProfile = async (userName: string) => {
  return cheerio.load(
    (await axios.get<string>(getProfileLink(userName))).data
  ) as UserProfile;
};

export const getProfileName = ($userProfile: UserProfile) => {
 return $userProfile(".user.profile .header h2").text().trim();
} 

export const getProfilePseuds = ($userProfile: UserProfile) => {
 const pseuds = $userProfile("dd.pseuds").text().concat(", ");
 return pseuds.slice(0, -2);
}
// slice here prevents pseuds from getting an extra ", " at the end 

export const getProfileJoined = ($userProfile: UserProfile) => {
 const dds = $userProfile(".meta dd:not(.pseuds)").text();
 return dds.slice(0, 10);
}
//slice here cuts the date off before it would run into the user ID

export const getProfileID = ($userProfile: UserProfile) => {
 return $userProfile(".meta dd:last-child").text();
}

export const getProfileBio = ($userProfile: UserProfile) => {
 return $userProfile(".userstuff").html();
}

//TODO: Pull information (Works/Series/Bookmarks/Collections/Gifts) from navigation actions maybe?

