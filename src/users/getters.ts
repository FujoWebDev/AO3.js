import { UserProfile } from "../page-loaders";
import { getUserProfileUrl } from "../urls";

//Dates are ten characters long in the following format:
const DATE_FORMAT = "0000-00-00";
//Constants for trimming the navigation menu content
const STAT_SUFFIX = ")";
const WORKS_PREFIX = "Works (";
const SERIES_PREFIX = "Series (";
const BOOKMARKS_PREFIX = "Bookmarks (";
const COLLECTIONS_PREFIX = "Collections (";
const GIFTS_PREFIX = "Gifts (";

export const getUserProfileName = ($userProfile: UserProfile) => {
  return $userProfile(".user.profile .header h2").text().trim();
};

const PSEUD_SUFFIX = ", ";
export const getUserProfilePseuds = ($userProfile: UserProfile) => {
  const pseuds = $userProfile("dd.pseuds a");
  const pseudsArray: string[] = [];

  if (pseuds.length !== 0) {
    pseuds.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/)!;

      pseudsArray.push(decodeURI(pseud));
    });
  }
  return pseudsArray.join(PSEUD_SUFFIX);
};

//Trim the results to only the date:
export const getUserProfileJoined = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email, .location, .birthday, .pseuds)"
  ).text();
  return dds.slice(0, DATE_FORMAT.length);
};

//Trim the results to only content after the date:
export const getUserProfileId = ($userProfile: UserProfile) => {
  const dds = $userProfile(
    ".meta dd:not(.email):not(dt.location+dd):not(.birthday):not(.pseuds)"
  ).text();
  return dds.slice(DATE_FORMAT.length);
};

export const getUserProfilePic = ($userProfile: UserProfile) => {
  const profilePic = $userProfile("img.icon").attr("src");
  if (!profilePic) {
    throw new Error("Users must have profile pic. Something is wrong.");
  }
  return profilePic;
};

export const getUserProfileHeader = ($userProfile: UserProfile) => {
  return (
    $userProfile("div.user.home.profile > h3.heading").text().trim() || null
  );
};

export const getUserProfileBio = ($userProfile: UserProfile) => {
  return $userProfile(".bio .userstuff").html();
};

// TODO: AO3 has started hiding email addresses from scrapers. Figure out how to get them
// and enable this again.
// export const getUserProfileEmail = ($userProfile: UserProfile) => {
//   return $userProfile("dd.email").text() || null;
// };

export const getUserProfileLocation = ($userProfile: UserProfile) => {
  return $userProfile("dt.location+dd").text() || null;
};

export const getUserProfileBirthday = ($userProfile: UserProfile) => {
  return $userProfile("dd.birthday").text() || null;
};

export const getUserProfileWorks = ($userProfile: UserProfile) => {
  return parseInt(
    $userProfile("#dashboard a[href$='works']")
      .text()
      .trim()
      .slice(WORKS_PREFIX.length, -STAT_SUFFIX.length) || "0"
  );
};

export const getUserProfileSeries = ($userProfile: UserProfile) => {
  return parseInt(
    $userProfile("#dashboard a[href$='series']")
      .text()
      .trim()
      .slice(SERIES_PREFIX.length, -STAT_SUFFIX.length) || "0"
  );
};

export const getUserProfileBookmarks = ($userProfile: UserProfile) => {
  return parseInt(
    $userProfile("#dashboard a[href$='bookmarks']")
      .text()
      .trim()
      .slice(BOOKMARKS_PREFIX.length, -STAT_SUFFIX.length) || "0"
  );
};

export const getUserProfileCollections = ($userProfile: UserProfile) => {
  return parseInt(
    $userProfile("#dashboard a[href$='collections']")
      .text()
      .trim()
      .slice(COLLECTIONS_PREFIX.length, -STAT_SUFFIX.length) || "0"
  );
};

export const getUserProfileGifts = ($userProfile: UserProfile) => {
  return parseInt(
    $userProfile("#dashboard a[href$='gifts']")
      .text()
      .trim()
      .slice(GIFTS_PREFIX.length, -STAT_SUFFIX.length) || "0"
  );
};
