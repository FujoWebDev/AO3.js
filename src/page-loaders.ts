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
import { ID } from "types/entities";

// This is a wrapper around the fetch function that loads the page into a CheerioAPI
// instance and returns the type of the page.

// By default, it also allows us to skip the adult banner.
const fetchPage = async <ReturnType>({
  url,
  skipAdultBanner = true,
}: {
  url: string;
  skipAdultBanner?: boolean;
}) => {
  return (await load(
    await (
      await getFetcher()(url, {
        headers: {
          Cookie: skipAdultBanner ? "view_adult=true;" : "",
        },
      })
    ).text()
  )) as ReturnType;
};

// We create separate interfaces for each page type to make sure that the
// correct type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.

// A page showing the most recent works featuring a tag.
// Sample: https://archiveofourown.org/tags/Git%20(The%20Fujoshi%20Guide%20to%20Web%20Development)/works
export interface TagWorksFeed extends CheerioAPI {
  kind: "TagWorksFeed";
}
export const loadTagWorksFeed = async ({ tagName }: { tagName: string }) => {
  return await fetchPage<TagWorksFeed>({
    url: getTagWorksFeedUrl(tagName),
  });
};

// A page showing the details of a tag.
// Sample: https://archiveofourown.org/tags/Git%20(The%20Fujoshi%20Guide%20to%20Web%20Development)
export interface TagPage extends CheerioAPI {
  kind: "TagPage";
}
export const loadTagPage = async ({ tagName }: { tagName: string }) => {
  return await fetchPage<TagPage>({
    url: getTagUrl(tagName),
  });
};

// Atom feed of the most recent works featuring a tag.
// Sample: https://archiveofourown.org/tags/91247110/feed.atom
export interface TagWorksAtomFeed extends CheerioAPI {
  kind: "TagWorksAtomFeed";
}
export const loadTagFeedAtomPage = async ({ tagId }: { tagId: string }) => {
  return await fetchPage<TagWorksAtomFeed>({
    url: getTagWorksFeedAtomUrl(tagId),
  });
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
  workId: ID;
  chapterId?: ID;
}) => {
  return await fetchPage<WorkPage>({
    url: getWorkUrl({ workId, chapterId }),
  });
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
  return await fetchPage<UserProfile>({
    url: getUserProfileUrl({ username }),
  });
};

export interface ChapterIndexPage extends CheerioAPI {
  kind: "ChapterIndexPage";
}
export const loadChaptersIndexPage = async ({ workId }: { workId: ID }) => {
  return await fetchPage<ChapterIndexPage>({
    url: `https://archiveofourown.org/works/${workId}/navigate`,
  });
};

export interface SeriesPage extends CheerioAPI {
  kind: "SeriesPage";
}
export const loadSeriesPage = async (seriesId: string) => {
  return await fetchPage<SeriesPage>({
    url: `https://archiveofourown.org/series/${seriesId}`,
  });
};
