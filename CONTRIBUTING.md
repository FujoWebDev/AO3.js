# Volunteering

...for fun and zero profit!

## The Ideal Volunteer™

You.

## The Ideal Volunteer™, jokes aside

AO3.js is a great entry point into JavaScript (or TypeScript) programming for
inexperienced and experienced developers alike. The library itself is pretty
straightforward, so you can get a good overview of the How and Why™ without a
lot of additional complexity.

## How to add more data to scrape

The best way to get to work on AO3.js is to choose a new set of data to scrape.

### Choose your data

To identify what we're missing (and tour the codebase as a bonus):

1. Take a look at our [TypeScript types](./types/entities.ts). If the data you
   seek is not there, we most likely can't scrape it (yet).
2. See if there's already [an open
   issue](https://github.com/essential-randomness/ao3.js/issues/) for the type
   of data you seek.
3. See if we're aready [scraping the page](./src/pages-loaders.ts) the data
   resides in.

Congratulations, you now have your first contribution carved for you!

### Contribution path

Once you've chosen the type of data, it's time to define its shape.

1. If there's already [an open
   issue](https://github.com/essential-randomness/ao3.js/issues/) describing the
   TypeScript type of the data you want to add, let us know you intend to
   implement the feature.
2. Submit a PR with the new TypeScript type you intend to implement under
   [`types/entities.ts`](./types/entities.ts), so we can review the API
   together. Alternatively, you can [open a new
   issue](https://github.com/essential-randomness/ao3.js/issues/new) to discuss
   beforehand.

If you don't know what any of this means, [open a new
issue](https://github.com/essential-randomness/ao3.js/issues/new) anyway and let
us help you through the process.

## How to Develop for AO3.js

The first step is always the same: run `npm install` and install all the
dependencies for the package.

### How to Run Tests

We use [Jest](https://jestjs.io/) as our testing framework.

To run tests, you can run `npm run test`. This will run all the tests then exit.

If you want tests to re-run on their own as you're making changes, you can run
Jest in `watch` mode by using `npm run test -- --watch` (mind the double `--`).

### How our Tests Handle Requests

This library works by fetching AO3 pages and scraping the resulting HTML.

To spare the poor AO3 servers (and to prevent our testing to be slowed down by rate limiting), we
use [MSW](https://mswjs.io/) to intercept HTTP requests to AO3 and serve local files instead.
You can find these files under the `tests/mocks/data` directory.

The structure of the folders mimics the structure of AO3 URLs. If you need to support a new type
of URL path, look under `tests/mocks/handlers` for an example of how to add new URL patterns.

#### Downloading New Pages for Tests

If you need a new page to be added for your tests, you can use the "`npm run download [page url]`" script
to fetch the page, encode the URL path correctly, and put it in the right folder.

Examples:

```
npm run download https://archiveofourown.org/tags/No%20Fandom%20-%20Freeform
npm run download https://archiveofourown.org/tags/No%20Fandom%20-%20Freeform/works.html
npm run download https://archiveofourown.org/tags/\!%20no%20idea%20how%20to%20tag%20this%20lol
```

### Redownloading Old Pages for Tests

Sometimes the HTML structure on AO3 pages will change! If you need to update all our mocks
to use the latest AO3 HTML, you can run `npm run redownload`.

> [!NOTE]
> Because of small differences in the downloaded HTML, most pages will be shown as
> having updates whenever you run `npm run redownload`, even if there haven't been
> changes to their structure. This is fine and expected. Just make sure all tests still pass!

We have a recurring data refresh job that automatically runs `npm run redownload` periodically
and warns us if our tests start failing. When that happens, we might need to release a new version
of the library that uses updated logic.

## Other contributions we're seeking

Some ideas off the top of our head:

- Set up our release process to be less manual
- Set up linting/styling and all the bell and whistles that make open source
  projects cool
- Autogenerate our documentation from TypeScript types
- Teach us all how to do semantic releases.

This library is your oyster. Just open an issue, and come have fun!
