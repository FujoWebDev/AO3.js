import {
  getTagUrl,
  getTagWorksFeedAtomUrl,
  getTagWorksFeedUrl,
  getUserProfileUrl,
  getWorkUrl,
} from "./urls";

import { CheerioAPI } from "cheerio";
import { load } from "cheerio/slim";
import { getFetcher } from "./fetcher";

// We create separate interfaces for each page type to make sure that the
// correct type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.

// A page showing the most recent works featuring a tag.
// Sample: https://archiveofourown.org/tags/Git%20(The%20Fujoshi%20Guide%20to%20Web%20Development)/works
export interface TagWorksFeed extends CheerioAPI {
  kind: "TagWorksFeed";
}
export const loadTagWorksFeed = async ({ tagName }: { tagName: string }) => {
  return load(
    await (await getFetcher()(getTagWorksFeedUrl(tagName))).text()
  ) as TagWorksFeed;
};

// A page showing the details of a tag.
// Sample: https://archiveofourown.org/tags/Git%20(The%20Fujoshi%20Guide%20to%20Web%20Development)
export interface TagPage extends CheerioAPI {
  kind: "TagPage";
}
export const loadTagPage = async ({ tagName }: { tagName: string }) => {
  return load(await (await getFetcher()(getTagUrl(tagName))).text()) as TagPage;
};

// Atom feed of the most recent works featuring a tag.
// Sample: https://archiveofourown.org/tags/91247110/feed.atom
export interface TagWorksAtomFeed extends CheerioAPI {
  kind: "TagWorksAtomFeed";
}
export const loadTagFeedAtomPage = async ({ tagId }: { tagId: string }) => {
  return load(
    await (await getFetcher()(getTagWorksFeedAtomUrl(tagId))).text()
  ) as TagWorksAtomFeed;
};

// The first page of a work.
// Sample: https://archiveofourown.org/works/46319041
export interface WorkPage extends CheerioAPI {
  kind: "WorkPage";
}
export const loadWorkPage = async ({
  workId,
  chapterId,
}: {
  workId: string;
  chapterId?: string;
}) => {
  return load(
    await (
      await getFetcher()(getWorkUrl({ workId, chapterId }), {
        headers: {
          // We set a cookie to bypass the Terms of Service agreement modal that
          // appears when viewing works as a guest, which prevented some
          // selectors from working. Appending ?view_adult=true to URLs doesn't
          // work for chaptered works since that part gets cleared when those
          // are automatically redirected.
          Cookie: "view_adult=true;",
        },
      })
    ).text()
  ) as WorkPage;
};

// A user profile page.
// Sample: https://archiveofourown.org/users/astolat/profile
export interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}
export const loadUserProfilePage = async ({
  username,
}: {
  username: string;
}) => {
  return load(
    await (await getFetcher()(getUserProfileUrl({ username }))).text()
  ) as UserProfile;
};

export interface ChapterIndexPage extends CheerioAPI {
  kind: "ChapterIndexPage";
}
export const loadChaptersIndexPage = async ({ workId }: { workId: string }) => {
  return load(
    await (
      await getFetcher()(`https://archiveofourown.org/works/${workId}/navigate`)
    ).text()
  ) as ChapterIndexPage;
};

export interface SeriesPage extends CheerioAPI {
  kind: "SeriesPage";
}
export const loadSeriesPage = async (seriesId: string) => {
  return load(
    await (
      await getFetcher()(`https://archiveofourown.org/series/${seriesId}`)
    ).text()
  ) as SeriesPage;
};
