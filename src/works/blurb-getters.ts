import type { Author, WorkBlurbSummary } from "types/entities";
import { type CheerioAPI, load } from "cheerio/slim";
import {
  getWorkBookmarkCount,
  getWorkHits,
  getWorkKudosCount,
  getWorkLanguage,
  getWorkPublishedChapters,
  getWorkTotalChapters,
  getWorkWordCount,
} from "src/works/work-getters";
import {
  getAsShortUrl,
  getAuthorFromUrl,
  getWorkDetailsFromUrl,
  getWorkUrl,
} from "src/urls";
import { parseArchiveId, parseBlurbDate } from "src/utils";

// AO3 renders works with the same blurb markup in every listing (series pages,
// user works pages...), so they all share this parser.
export interface WorkBlurb extends CheerioAPI {
  kind: "WorkBlurb";
}

export const getWorkBlurb = (blurbHtml: string): WorkBlurbSummary => {
  const $work = load(blurbHtml) as WorkBlurb;

  const relativeUrl = $work("h4.heading a[href*='/works/']")
    .first()
    .attr("href");
  const title = $work("h4.heading a[href*='/works/']").first().text().trim();

  if (!relativeUrl || !title) {
    throw new Error("Work blurb is missing its title or URL");
  }

  const id = getWorkDetailsFromUrl({ url: relativeUrl }).workId;
  const url = getWorkUrl({ workId: id });
  const totalChapters = getWorkTotalChapters($work);
  const publishedChapters = getWorkPublishedChapters($work);

  return {
    id: parseArchiveId(id),
    url,
    shortUrl: getAsShortUrl({ url }),
    title,
    updatedAt: parseBlurbDate($work("p.datetime").text()),

    summary: getWorkBlurbSummary($work),
    adult: false,
    fandoms: getWorkBlurbTags($work, "h5.fandoms a.tag"),
    tags: {
      characters: getWorkBlurbTags($work, "li.characters a.tag"),
      relationships: getWorkBlurbTags($work, "li.relationships a.tag"),
      additional: getWorkBlurbTags($work, "li.freeforms a.tag"),
    },
    authors: getWorkBlurbAuthors($work),
    language: getWorkLanguage($work),
    words: getWorkWordCount($work),
    chapters: {
      published: publishedChapters,
      total: totalChapters,
    },
    complete: totalChapters !== null && totalChapters === publishedChapters,
    stats: {
      bookmarks: getWorkBookmarkCount($work),
      kudos: getWorkKudosCount($work),
      hits: getWorkHits($work),
    },
  };
};

const getWorkBlurbSummary = ($work: WorkBlurb) => {
  const summary = $work("blockquote.summary").html();
  return summary ? summary.trim() : null;
};

const getWorkBlurbTags = ($work: WorkBlurb, selector: string) => {
  return $work(selector)
    .map((_index, element) => $work(element).text().trim())
    .get();
};

const getWorkBlurbAuthors = ($work: WorkBlurb) => {
  const authorLinks = $work("h4.heading a[rel='author']");

  // Anonymous works list "Anonymous" as plain text instead of an author link.
  if (
    authorLinks.length === 0 &&
    /\bby\s+Anonymous\s*$/.test($work("h4.heading").text())
  ) {
    return [{ username: "Anonymous", pseud: "Anonymous", anonymous: true }];
  }

  const authors: Author[] = [];
  authorLinks.each((_index, element) => {
    authors.push(getAuthorFromUrl({ url: element.attribs.href }));
  });

  if (authors.length === 0) {
    throw new Error("Work blurb is missing its author");
  }

  return authors;
};
