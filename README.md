# AO3.js
NodeJS library for scraping AO3 data.

You can install it with `yarn add @bobaboard/ao3.js` or `npm install @bobaboard/ao3.js`, but be aware this is still in a highly unstable phase.

AO3.js uses [axios](https://axios-http.com/) to fetch the HTML making up an AO3 page and [cheerio](https://cheerio.js.org/) to make it a DOM tree for our goals. For an introduction to this kind of scraping, [see here](https://blog.logrocket.com/parsing-html-nodejs-cheerio/).

An explanation of how AO3.js works and suggestions for how to add to it can be found [in this comment](https://github.com/essential-randomness/AO3.js/issues/2#issuecomment-1032213524).