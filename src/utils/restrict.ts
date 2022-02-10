import cheerio, { CheerioAPI } from "cheerio";

import axios from "axios";

interface CheckRestricted extends CheerioAPI {
  kind: "CheckRestricted";
}

export interface Restricted {
 locked: boolean;
}

export const getCheckingURL = (workID: string) => 
 `https://archiveofourown.org/works/${workID}`;

export const getLockedCheck = async (workID: string) => {
 return cheerio.load(
   (await axios.get<string>(getCheckingURL(workID))).data
 ) as CheckRestricted;
};

export const checkLock = ($checkRestricted: CheckRestricted) => {
 const checking = $checkRestricted("#signin > .heading)").text();
 if (checking) {
  return true;
 } else { return false; }
}