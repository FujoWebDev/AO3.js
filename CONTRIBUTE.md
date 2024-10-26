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
3. See if we're aready [scraping the page](./src/pages-loaders.ts) the data resides in.

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
