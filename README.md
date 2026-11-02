# AO3.js

<div align="center">

![AO3.js logo](./logo-transparent-small.png)

Pulls data from [ao3.org](https://ao3.org) and beyond. Now with Types™.

<!-- Add the <a> so IMGs will stay on the same line -->
<a href="#">
    <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/essential-randomness/ao3.js/main" />
</a>
<a href="#">
    <img alt="GitHub" src="https://img.shields.io/github/license/essential-randomness/ao3.js" />
</a>
<a href="https://gitpod.io/from-referrer/">
    <img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"/>
</a>
<a href="https://fancoders.com/">
    <img src="https://img.shields.io/badge/fandom-coders-ff69b4" alt="Fandom Coders badge"/>
</a>
<a href="https://npmjs.com/package/@fujocoded/ao3.js">

![npm version](https://img.shields.io/npm/v/@fujocoded/ao3.js)

</a>
</div>

## What is `@fujocoded/ao3.js`?

**AO3.js is a Node.js library for fetching Archive of Our Own data** from your own JavaScript (or TypeScript!) server or command line tool. It provides an easy-to-use interface for retrieving information like tags, works, series, and more, from any AO3-compatible archive.

## What can `@fujocoded/ao3.js` do?

| Method                                                | Description                                | Parameters                                                                        | Return Type                                                                                                              |
| ----------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [**`getTag`**](./src/tags/index.ts#L17)               | Retrieves details for a specific AO3 tag.  | `{ tagName: string }` - Name of the tag.                                          | [`Promise<Tag>`](./types/entities.ts)                                                                                    |
| [**`getTagNameById`**](./src/tags/index.ts#L24)       | Gets tag name based on its ID.             | `{ tagId: string }` - Tag ID to look up.                                          | `Promise<string>`                                                                                                        |
| [**`getWork`**](./src/works/index.ts#L20)             | Fetches metadata for an AO3 work.          | `{ workId: string, chapterId?: string }` - The work ID, with optional chapter ID. | [`Promise<WorkSummary>`](./types/entities.ts#L20) \| [`Promise<LockedWorkSummary>`](./types/entities.ts#L45)             |
| [**`getWorkWithChapters`**](./src/works/index.ts#L53) | Fetches a work and its chapter list.       | `{ workId: string }` - The ID of the work.                                        | [`Promise<{ title: string; authors: Author[] \| Anonymous; workId: string; chapters: Chapter[] }>`](./types/entities.ts) |
| [**`getSeries`**](./src/series/index.ts#L17)          | Retrieves details for a specific series.   | `{ seriesId: string }` - The ID of the series.                                    | [`Promise<Series>`](./types/entities.ts)                                                                                 |
| [**`getUser`**](./src/users/index.ts#L15)             | Fetches profile information for a user.    | `{ username: string }` - Username of the user to fetch.                           | [`Promise<User>`](./types/entities.ts)                                                                                   |
| [**`getUserWorks`**](./src/users/index.ts#L63)        | Lists one page of a user's public works.   | `{ username: string, pseud?: string, page?: number, sortColumn?, sortDirection? }` | [`Promise<UserWorks>`](./types/entities.ts)                                                                              |
| [**`parseEpubWork`**](./src/downloads/epub/index.ts#L14)   | Reads a work from an AO3 EPUB download. Import it from `@fujocoded/ao3.js/downloads`. | `{ epub: Uint8Array }` - The EPUB's contents.                            | [`DownloadedWork`](./types/entities.ts)                                                                                  |
| [**`parsePdfWork`**](./src/downloads/pdf/index.ts#L34)    | Reads a work from an AO3 PDF download. Import it from `@fujocoded/ao3.js/downloads`, and install `unpdf`. PDFs accuracy is "best effort" compared to EPUB. | `{ pdf: Uint8Array }` - The PDF's contents. | [`Promise<DownloadedWork>`](./types/entities.ts) |
| [**`setFetcher`**](./src/fetcher.ts#L5)               | Sets a custom fetch function for requests. | `{ fetcher: typeof fetch }` - Custom fetch function.                              | `void`                                                                                                                   |
| [**`withRetry`**](./src/fetcher.ts)                 | Wraps a fetch function to retry rate limits, server errors and network errors. | `(fetch, options?: RetryOptions)` | `typeof fetch` |
| [**`withCache`**](./src/fetcher.ts)                 | Wraps a fetch function to keep pages in memory and reuse them. | `(fetch, options?: CacheOptions)` | `typeof fetch` |

#### Why Override Fetch?

Using `setFetcher`, you can override the default `fetch` method used by the library. This can be useful if:

- You need to provide custom headers for authentication or API key access.
- You want to use a different network library for enhanced functionality (e.g., retrying failed requests).
- You are working in a Node environment without native fetch support and need a polyfill.

### Data Types

- **[`Tag`](./types/entities.ts)**: Details about a tag, including `id`, `name`, `category`, and metadata.
- **[`WorkSummary`](./types/entities.ts#L20)** / **[`LockedWorkSummary`](./types/entities.ts#L45)**: Summarizes a work, including title, authors, tags, and statistics.
- **[`Series`](./types/entities.ts)**: Information on a series, such as title, authors, works, and publication details.
- **[`User`](./types/entities.ts)**: Profile information for an AO3 user, including pseudonyms, works, bookmarks, and more.
- **[`UserWorks`](./types/entities.ts)**: One page of a user's public works, with pagination.
- **[`Chapter`](./types/entities.ts)**: Details about individual chapters within a work.

## Sample usage

With yarn

```sh
yarn add @fujocoded/ao3.js
```

or npm

```sh
npm install @fujocoded/ao3.js
```

Then go to town in your JavaScript (or TypeScript) files:

```ts
import { getTag, getWork } from "@fujocoded/ao3.js";

const tag = await getTag({
  tagName: "Ever Given Container Ship (Anthropomorphic)",
});
const work = await getWork({ workId: 123456 });
```

Further explanation of AO3.js works and suggestions for how to add to it can be found [in this comment](https://github.com/essential-randomness/AO3.js/issues/2#issuecomment-1032213524). Also consider taking a look at [TypeScript types](./types/entities.ts).

## About "🚨 Data Refresh Tests Failed" issues

See [CONTRIBUTING.md](CONTRIBUTING.md#about--data-refresh-tests-failed-issues) for what these issues mean and how to help fix them.

## Important Notes

### Parameters Are Objects!

Most methods in the public interface expect parameters to be passed as objects rather than individual arguments. This allows flexibility in expanding parameters without breaking the interface.

### If you run into CORS errors

This library is meant to be used as part of a NodeJS application and run on a server. If you try to run it as part of a browser application, you'll run into an error about [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). In short—for your protection—browsers block data requests from a website to another, unless the destination website specifically allows such requests to be made. AO3 doesn't.

If you want to run a browser application written with this library, users will need a browser extension to allow CORS requests, [like this one for Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en).

### Difference between this and the Python library

JavaScript vs Python aside, this is a newer library that is being actively developed, and is not feature complete. If you'd like for us to prioritize a feature, [please open an issue](https://github.com/essential-randomness/ao3.js/issues/new).

## How It Works

AO3.js uses:

- [the fetch
  API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to fetch the HTML
  making up an AO3 page
- [cheerio](https://cheerio.js.org/) to make it a DOM
  tree for our goals.

For an introduction to this kind of scraping, [see
here](https://blog.logrocket.com/parsing-html-nodejs-cheerio/).

For the rest of the owl, you can reach us through our [Issues
tab](https://github.com/essential-randomness/ao3.js/issues), or at [Fandom
Coders](https://fancoders.com/).

## Overriding fetch

If you wish to provide more complex logic for `fetch` (for example to handle
rate limiting), you can override the fetch method with your own implementation
by using the exported `setFetcher` function.

For example, to override `fetch` with the `node-fetch` implementation:

```ts
import { setFetcher } from "@fujocoded/ao3.js";
import fetch from "node-fetch";

// You MUST call this before calling other ao3.js methods
setFetcher(fetch);
```

### Handling rate limiting

If you make too many requests to AO3 too quickly, AO3 will ask you to wait! Wrap
your fetch in `withRetry` and the library will wait as long as AO3 asks before, well,
retrying:

```ts
import { setFetcher, withRetry } from "@fujocoded/ao3.js";

setFetcher(withRetry(fetch));
```

`withRetry` also retries AO3 server errors and network failures, waiting a bit
longer each time. Other errors, like a missing work, are returned right away.
You can change how it behaves:

```ts
setFetcher(
  withRetry(fetch, {
    // How many times to wait out a rate limit (default: 10)
    maxRateLimitRetries: 20,
    // How many times to retry server and network errors (default: 3)
    maxRetries: 5,
    // Give up instead of waiting if AO3 asks for a longer wait (default: no limit)
    maxRetryAfterMs: 5 * 60 * 1000,
    // Log each wait, since by default withRetry stays quiet
    onRetry: ({ attempt, delayMs }) =>
      console.log(`Retry ${attempt} in ${Math.round(delayMs / 1000)}s`),
  }),
);
```

When retries run out, the library throws an `ArchivePageRequestError` with the
last status AO3 sent, or rethrows the last network error.

### Caching

By default, this library doesn't cache requests: if you call the same method
twice, it asks AO3 twice. Wrap your fetch in `withCache` to keep pages in memory
for a while instead:

```ts
import { setFetcher, withCache, withRetry } from "@fujocoded/ao3.js";

// withCache goes on the outside, so cached pages skip retrying
setFetcher(withCache(withRetry(fetch)));
```

`withCache` keeps up to 500 successful pages for 5 minutes. You can
change the limits:

```ts
setFetcher(
  withCache(withRetry(fetch), {
    // How long a page stays saved, in milliseconds (default: 5 minutes)
    ttlMs: 60 * 60 * 1000,
    // How many pages to keep (default: 500)
    maxEntries: 2000,
  }),
);
```

The cache lives in memory, so it only keeps its data while your program is running.

# How do I help?

See [CONTRIBUTING.md](CONTRIBUTING.md).
