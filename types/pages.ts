import { CheerioAPI } from "cheerio";

// We create separate interfaces for each page type to make sure that the
// correct type of page is passed to each method that extracts data.
// Other than this, all pages are instances of CheerioAPI and can be used interchangeably.

// Sample: https://archiveofourown.org/tags/Tsukishima%20Kei*s*Reader/works
export interface TagWorksFeed extends CheerioAPI {
  kind: "TagWorksFeed";
}

// Sample: https://archiveofourown.org/tags/Tsukishima%20Kei*s*Reader
export interface TagPage extends CheerioAPI {
  kind: "TagPage";
}

// Sample: https://archiveofourown.org/tags/2722176/feed.atom

export interface TagWorksAtomFeed extends CheerioAPI {
  kind: "TagWorksAtomFeed";
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
