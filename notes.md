<h1>Notes</h1>

<h2>Creating and Using Mocks</h2>

Mocks are offline webpages that are used to test our scripts.

**To create a mock** you need to

1. create the directory
2. download and add the prompt page with curl.

```
curl https://archiveofourown.org/works/51394438/chapters/136175206 > tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428.html
```
This command will not work (1) if you are using Powershell, and (2) if the path does not yet exist. In order to use curl on Windows, open it in a git bash terminal. Powershell will do *something*, but not what we want it to.

To create the directory structure at the same time you use run curl, run this in the project's base directory:

```
curl --create-dirs --output tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806.html https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1927806
```

curl --create-dirs --output tests/mocks/data/collections/test_prompt_meme_2024/prompts/3583348.html https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3583348

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

I used this script to get tags from the prompt fills via the console. First, I needed to define $0 as a parent element. Then I put this into the console.

```js
To get freeforms:              
let q = $0 //on parent
w = [... q.querySelectorAll("li.characters a.tag")]
let ar = []
w.forEach((e)=>{ar.push(e.innerText)});
ar
```

---

# Attribute Descriptions

* **postedAt** The date the prompt was posted.
* **summary**: The test description of the prompt, as html
* **collectionDisplayTitle**: the title displayed on the collection pages and in tags. Not the same as collectionName, which is used to contruct the collection's url. 
* **ratings**: a list of the requested ratings on the prompt. The prompt will display the highest of these on its UI. If the prompt has no ratings, "Not Rated" will be returned.
* **claims**: [Object] claims exist when users have "claimed" a prompt, but not yet filled it. Claims can have three different types of structres. To check if a variable exists, you can check the variable it depends on (eg. check `count > 0 before` accessing isAnonCollection and `inAnonCollection === false` before accessing claimerUsernames), or use `if "isAnonCollection" in variable`.
  * `{count: 0}` There are no claims. We don't know if the collection is anonymous or not.
  * `{count: number; isAnonCollection: true; }` There is a non-zero amount of anonymous claims.
  * `{count: number; isAnonCollection: false; claimerUsernames: string[]}` There is a non-zero amount of claimers, and the collection isn't anonymous, and you can return an array of strings containing their **usernames** not pseuds; (it's unknown if they have pseuds).
* **categories**: `null | string[]`<br>
null if no categories are selected, or an array of strings (WorkCategory objects).<br>

# TODO: 

Questions: 
* Do we want characters, additional and ship tags to return a null if there are no tags in that category?

* ✅ Get additional tags from prompts with multiple fills
* ✅ Get character tags from prompts with multiple fills
* ✅ Get warning tags from prompts with multiple fills
* 🟡 get prompt title (anon and not anon author, title and no title prompt meme)
* 🟡 get works
* 🟡 reimplement claims, possibly as `claims: { count: number, usernames: string[] | null } | null;`


in Fandom Coders, the idea of returning `null` if there are no warnings was brought up. However, I (RabbitPie) am not sure which variable would be considered "no warnings"? No Archive Warnings apply? "Author chose not to use archive warnings"?

✅ Task Complete
🟡 Task Incomplete or not started

# Done:

1. As part of the query selector issue: More thorough tests to test different types of prompts in their entirety. The goal is not to have them pass immediately. I'll have to see how the series-getter approaches the issue of multiple works associated with a a request.
    1. Multiple known claimants 
       * ✅ [Mock created](/tests/mocks/data/collections/test_prompt_meme_2024/prompts/3583348.html)
       * ✅ Test Created 
       * ✅ Test Passed    
    2. Multiple anon claimants
       * ✅ [Mock Created](/tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1909048.html)
       * ✅ Test Created <small>(prompts.test.ts > describe("Fetches full Prompt") callback)</small>
       * ✅ Test Passed
    3. Multiple fills
       * ✅ [Mock Created - Same as Previous](/tests/mocks/data/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1909048.html)
       * ✅ Test Created <small>(prompts.test.ts > describe("Fetches full Prompt") callback)</small>
       * ✅ Test Passed

* ✅ Get Categories
  * ✅ Establish Category structure
  * ✅ Create test for no categories
  * ✅ Create test for one category
  * ✅ Create test for multiple categories
  * ✅ Create test for multiple fills
  * ✅ Pass tests
* ✅ Get collectionName
* ✅ get collection id


