import { CheerioAPI } from "cheerio";

// We create separate interfaces for each page type to make sure that the
// correct type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.

export interface WorksFeed extends CheerioAPI {
  kind: "WorksFeed";
}

export interface WorkPage extends CheerioAPI {
  kind: "WorkPage";
}

export interface UserProfile extends CheerioAPI {
  kind: "UserProfile";
}

export interface FeedPage extends CheerioAPI {
  kind: "FeedPage";
}

export interface TagPage extends CheerioAPI {
  kind: "TagPage";
}
