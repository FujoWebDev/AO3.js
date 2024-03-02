**creating a mock of a prompt** is a two-step process:

1. create the directory
2. download and add the prompt page with curl.

curl https://archiveofourown.org/works/51394438/chapters/136175206 > tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428.html

1. mkdir tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/
2. curl https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428 > tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428.html



actually... mkdir failed because it wouldn't create multiple levels of directory. huh. I had to do it twice with first the collection name, and then the prompts. 

A beter solution: curl --create-dirs --output tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806.html https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806

! note: The result of curl may be different depending on your terminal and your OS. I use windows and had to open up a new "Git Bash" terminal. 

curl info here: https://man.developpez.com/man1/curl/#:~:text=%2D%2Dcreate%2Ddirs%20When%20used,no%20dir%20will%20be%20created.


---

I'm now **troubleshooting** a new an issue with getting the mock route to fuction correctly, so I decided to **create a new test script**. To do this, I added a new line to scripts (test-1) which now reads: 
```js
"scripts": {
    "build": "rm -rf dist/ && tsup src/index.ts src/urls.ts --format esm,cjs --dts",
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --no-cache .test.ts$ --verbose=true",
    "test-1": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --no-cache prompts.test.ts$ --verbose=true",
    "encode-mock-files": "ts-node-esm tests/mocks/scripts/encode-mock-files.mts"
  },
```
this can be run with the command npm run test-1.

---

When adding the new route handler to handlers.ts, ensure that the new export goes *before* `allHandlers`. Otherwise, allHandlers will handle your route instead.

```js
export default [
  profileHandlers,
  feedHandlers,
  tagWorksHandlers,
  worksHandlers,
  nameHandlers,
  workPageHandlers,
  worksNavigateHandlers,
  worksChapterHandlers,
  seriesHandlers,
  promptHandlers,
  allHandlers
];
```
note that my new Handler, promptHandlers, is before allHandlers, which is last.


my first attempt to create a mock route did not work, so I went to look at the documentation to see if I could gain a better understanding of why, and what was going on. https://mswjs.io/docs/api/http/#httpall

Files I'm inspecting: 
1. [./tests\mocks\handlers\all.ts](./tests\mocks\handlers\all.ts)
1. [TypeScript types](./tests\mocks\handlers\collections\prompt.ts)
2. 

...ok, curl did not work?!?

https://curl.se/docs/
--create-dirs


---

I'm creating these notes with a markdown file that I created by making a new file called notes.md. the .md is a file extension that indicates it's a markdown file. 

I've used three hyphens: --- to create horizontal rules separating the sections. 

I've used numbers: 1. to create a numbered list. 

I've used three backtics followed by js ```js to create the new js file. 

writing something directly before a --- will cause it to become a heading?

---

When getting the collection display title from the scraper in [prompt-getters](src\collections\prompts\prompt-getters.ts), my test initially failed because the the returned information had newlines at the beginning and end. I removed them with .trim().

The display title is the "display" name of the collection eg. "Mó Dào Zǔ Shī | The Untamed Kink Meme 2020" which is in contrast to the collection name, which appears in the url: mo_dao_zu_shi_kink_meme_2020

---

A work can have multiple ratings values, or none. Therefore what we return will be an array. 

This one has General, Teen and Mature ratings, so I used to in the test: 
https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806

now, to add it to the local file path...

curl --create-dirs --output tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806.html https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806

getting the ratings was make more difficult by the fact I didn't have the correct key in my toMatchObject(Object) parameter. I misspelled it, and that caused me trouble!

The error showed all possible key/value pairs that might be in the object, which confused me a lot.

---

Deciding how to name my boolean I looked it up and grabbed this quote:

In many languages, the convention for naming Booleans is typically to prefix them with "is", "has" or "can". This convention seems to be applied mostly to fields and method

---

What these attributes actually do: 

updatedAt: The last date the prompt was updated. Appears in the upper-right hand corner of a prompt. (I am not actually certain this is the updated date and not the posted date at present, currently performing a test here: https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3564199)
summary: The test description of the prompt, as html
collectionDisplayTitle: the title displayed on the collection pages and in tags. Not the same as collectionName, which is used to contruct the collection's url. 
ratings: a list of the requested ratings on the prompt. The prompt will display the highest of these on its UI. If the fic has no ratings, "Not Rated" will be returned.

Test change.