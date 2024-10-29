# AO3.js

<div align="center">

![AO3.js logo](./logo-transparent-small.png)

Scrapes data from [ao3.org](https://ao3.org). Now with Types™.

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
</div>

## What it is

**AO3.js** is a Node.js (et al.) API for scraping AO3 (Archive of Our Own) data straight to your own JavaScript (or TypeScript) server. It provides an interface to retrieve information on AO3 tags, works, series, and more!

## What is capable of

| Method                                                | Description                                | Parameters                                                                        | Return Type                                                                                                              |
| ----------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [**`getTag`**](./src/tags/index.ts#L17)               | Retrieves details for a specific AO3 tag.  | `{ tagName: string }` - Name of the tag.                                          | [`Promise<Tag>`](./types/entities.ts)                                                                                    |
| [**`getTagNameById`**](./src/tags/index.ts#L24)       | Gets tag name based on its ID.             | `{ tagId: string }` - Tag ID to look up.                                          | `Promise<string>`                                                                                                        |
| [**`getWork`**](./src/works/index.ts#L20)             | Fetches metadata for an AO3 work.          | `{ workId: string, chapterId?: string }` - The work ID, with optional chapter ID. | [`Promise<WorkSummary>`](./types/entities.ts#L20) \| [`Promise<LockedWorkSummary>`](./types/entities.ts#L45)             |
| [**`getWorkWithChapters`**](./src/works/index.ts#L53) | Fetches a work and its chapter list.       | `{ workId: string }` - The ID of the work.                                        | [`Promise<{ title: string; authors: Author[] \| Anonymous; workId: string; chapters: Chapter[] }>`](./types/entities.ts) |
| [**`getSeries`**](./src/series/index.ts#L17)          | Retrieves details for a specific series.   | `{ seriesId: string }` - The ID of the series.                                    | [`Promise<Series>`](./types/entities.ts)                                                                                 |
| [**`getUser`**](./src/users/index.ts#L15)             | Fetches profile information for a user.    | `{ username: string }` - Username of the user to fetch.                           | [`Promise<User>`](./types/entities.ts)                                                                                   |
| [**`setFetcher`**](./src/fetcher.ts#L5)               | Sets a custom fetch function for requests. | `{ fetcher: typeof fetch }` - Custom fetch function.                              | `void`                                                                                                                   |

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
- **[`Chapter`](./types/entities.ts)**: Details about individual chapters within a work.

## Sample usage

With yarn

```sh
yarn install @bobaboard/ao3.js
```

or npm

```sh
npm install @bobaboard/ao3.js
```

Then go to town in your JavaScript (or TypeScript) files:

```ts
import { getTag, getWork } from "@bobaboard/ao3.js";

const tag = await getTag({
  tagName: "Ever Given Container Ship (Anthropomorphic)",
});
const work = await getWork({ workId: "123456" });
```

Further explanation of AO3.js works and suggestions for how to add to it can be found [in this comment](https://github.com/essential-randomness/AO3.js/issues/2#issuecomment-1032213524). Also consider taking a look at [TypeScript types](./types/entities.ts).

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

## `ReferenceError`: `fetch` is not defined

This error means your runtime (e.g. NodeJS) does not include a `fetch`
implementation. The easiest way to fix this issue, is to switch to a runtime
that does support it. For NodeJS, this is any version above (and including)
`18`.

If you need to use a older version of NodeJS, you can polyfill it by using the
[`node-fetch` library](https://github.com/node-fetch/node-fetch).

In your terminal run:

```sh
npm install node-fetch@2
```

If you wish to override `fetch` with your own implementation, you can use the
`setFetcher` method to use the fetch returned by the `node-fetch` library. See
next section for more details.

```ts
import { setFetcher } from "@bobaboard/ao3.js";
import fetch from "node-fetch";

// You MUST call this before calling other ao3.js methods
setFetcher(fetch);
```

## Overriding fetch

If you wish to provide more complex logic for `fetch` (for example to handle
rate limiting), you can override the fetch method with your own implementation
by using the exported `setFetch` function.

For example, to override `fetch` with the `node-fetch` implementation:

```ts
import { setFetcher } from "@bobaboard/ao3.js";
import fetch from "node-fetch";

// You MUST call this before calling other ao3.js methods
setFetcher(fetch);
```

### Handling caching + rate limiting

This library doesn't handle caching requests by default. This means that if you
call the same method twice, the underlying requests to AO3 will also be made
twice.

Similarly, this library doesn't handle managing rate limit for you (not yet, at
least). This means that if you make too many requests to AO3 too quickly, you'll
get errors once AO3 starts asking you to pause requests.

If you want to avoid these issues, you can use the following code to add caching and
automatic retrying to the library:

```ts
import { setFetcher } from "@bobaboard/ao3.js";

const CACHE = new Map();
setFetcher(async (...params: Parameters<typeof fetch>) => {
  try {
    if (CACHE.has(params[0])) {
      console.log(`Using cached response for request to ${params[0]}`);
      return CACHE.get(params[0]).clone();
    }
    console.log(`Making a new request to ${params[0]}`);
    let response = await fetch(...params);
    console.log(`Request status: ${response.status}`);
    while (response.status === 429) {
      const waitSeconds = response.headers.get("retry-after");
      console.log(
        `Asked to wait ${waitSeconds} seconds request to ${params[0]}`
      );
      if (!waitSeconds) {
        throw new Error(
          "A wait request was made without indication of length."
        );
      }
      console.log(`Waiting ${waitSeconds} seconds`);
      await new Promise((res) => {
        setTimeout(() => res(null), parseInt(waitSeconds) * 1000);
      });
      console.log(`Continuing with request to ${params[0]}`);
      response = await fetch(...params);
    }
    if (response.status === 200) {
      // Remove request from the cache after 5 minutes
      setTimeout(() => {
        console.log(`Clearing cache entry for request ${params[0]}`);
        CACHE.set(params[0], null);
      }, 1000 * 60 * 5);
      console.log(`Setting cache entry for request ${params[0]}`);
      CACHE.set(params[0], response.clone());
    }
    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
```

The logging will help you understand what's going on, but it's by no mean necessary.

# How do I help?

See (CONTRIBUTE.md)[CONTRIBUTE.md].
