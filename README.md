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

Fetch data from AO3 straight to your own JavaScript (or TypeScript) server.

## How to use it

With yarn

```sh
yarn install @bobaboard/ao3.js
```

or npm

```sh
npm install @bobaboard/ao3.js
```

Then go to town on your JavaScript (or TypeScript) files

```ts
import { getTag } from "@bobaboard/ao3.js";

const tag = await getTag({
  tagName: "Ever Given Container Ship (Anthropomorphic)",
});
```

Further explanation of AO3.js works and suggestions for how to add to it can be found [in this comment](https://github.com/essential-randomness/AO3.js/issues/2#issuecomment-1032213524). Also consider taking a look at [TypeScript types](./types/entities.ts).

## A note about CORS

This library is meant to be used as part of a NodeJS application and run on a server. If you try to run it as part of a browser application, you'll run into an error about [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). In short—for your protection—browsers block data requests from a website to another, unless the destination website specifically allows such requests to be made. AO3 doesn't.

If you want to run a browser application written with this library, users will need a browser extension to allow CORS requests, [like this one for Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en).

## Difference between this and the Python library

JavaScript vs Python aside, this is a newer library that is being actively developed, and is not feature complete. If you'd like for us to prioritize a feature, [please open an issue](https://github.com/essential-randomness/ao3.js/issues/new).

# Documentation

AO3.js uses [the fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to fetch the HTML
making up an AO3 page and [cheerio](https://cheerio.js.org/) to make it a DOM
tree for our goals. For an introduction to this kind of scraping, [see
here](https://blog.logrocket.com/parsing-html-nodejs-cheerio/).

For the rest of the owl, you can reach us through our [Issues
tab](https://github.com/essential-randomness/ao3.js/issues), or at [Fandom
Coders](https://fancoders.com/).

## `RefernceError`: `fetch` is not defined

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

# Volunteering

...for fun and zero profit!

## The Ideal Volunteer™

You.

## The Ideal Volunteer™, jokes aside

AO3.js is a great entry point into JavaScript (or TypeScript) programming for inexperienced and experienced developers alike. The library itself is pretty straightforward, so you can get a good overview of the How and Why™ without a lot of additional complexity.

## How to add more data to scrape

The best way to get to work on AO3.js is to choose a new set of data to scrape.

### Choose your data

To identify what we're missing (and tour the codebase as a bonus):

1. Take a look at our [TypeScript types](./types/entities.ts). If the data you seek is not there, we most likely can't scrape it (yet).
2. See if there's already [an open issue](https://github.com/essential-randomness/ao3.js/issues/) for the type of data you seek.
3. See if we're aready [scraping the page](./src/page-loaders.ts) the data resides in.

Congratulations, you now have your first contribution carved for you!

### Contribution path

Once you've chosen the type of data, it's time to define its shape.

1. If there's already [an open issue](https://github.com/essential-randomness/ao3.js/issues/) describing the TypeScript type of the data you want to add, let us know you intend to implement the feature.
2. Submit a PR with the new TypeScript type you intend to implement under [`types/entities.ts`](./types/entities.ts), so we can review the API together. Alternatively, you can [open a new issue](https://github.com/essential-randomness/ao3.js/issues/new) to discuss beforehand.

If you don't know what any of this means, [open a new issue](https://github.com/essential-randomness/ao3.js/issues/new) anyway and let us help you through the process.

## Other contributions we're seeking

Some ideas off the top of my head:

- Set up our release process
- Set up linting/styling and all the bell and whistles that make open source projects cool
- Autogenerate our documentation from TypeScript types
- Teach us all how to do semantic releases.

Honestly, this library is your oyster. Just open an issue, and let's roll!
