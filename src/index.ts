import cheerio, { CheerioAPI } from "cheerio";

import { setup } from "axios-cache-adapter";

const fetcher = setup({
  cache: {
    maxAge: 15 * 60 * 1000,
  },
});

interface Tag {
  name: string;
  id: string;
  canonical: boolean;
}

const getTagUrl = (tagName: string) =>
  `https://archiveofourown.org/tags/${encodeURI(tagName)}`;
const getWorksUrl = (tagName: string) => `${getTagUrl(tagName)}/works`;

const getTagIdFromPage = ($worksPage: CheerioAPI) => {
  return $worksPage(".rss")[0].attribs["href"].split("/")[2];
};

const isCanonical = ($tagPage: CheerioAPI) => {
  return $tagPage(".merger").length === 0;
};

export const getTag = async (tagName: string): Promise<Tag> => {
  const tagPage = await fetcher.get<string>(getTagUrl(tagName));
  const worksPage = await fetcher.get<string>(getWorksUrl(tagName));

  return {
    name: tagName,
    id: getTagIdFromPage(cheerio.load(worksPage.data)),
    canonical: isCanonical(cheerio.load(tagPage.data)),
  };
};
