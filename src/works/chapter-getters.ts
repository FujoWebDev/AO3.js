import type { Author, Chapter } from "../../types/entities";
import { getAsShortUrl, getWorkDetailsFromUrl, getWorkUrl } from "../urls";

import { ChapterIndexPage } from "../page-loaders";

const TITLE_SEPARATOR = ". ";
export const getChaptersList = ($chapterIndexPage: ChapterIndexPage) => {
  const chapters: Chapter[] = [];
  $chapterIndexPage("ol.index > li").each((index, li) => {
    const link = $chapterIndexPage(li).find("a")[0];
    const chapterText = $chapterIndexPage(link).text();
    const { workId, chapterId } = getWorkDetailsFromUrl({
      url: link.attribs.href,
    });
    const title = chapterText.substring(
      chapterText.indexOf(TITLE_SEPARATOR) + TITLE_SEPARATOR.length
    );
    const dateNode = $chapterIndexPage(
      $chapterIndexPage(li).find(".datetime")[0]
    );
    const url = getWorkUrl({ workId, chapterId });
    const shortUrl = getAsShortUrl({ url });
    chapters.push({
      id: chapterId!,
      workId,
      index: index + 1,
      title,
      // Remove parenthesis from the date
      publishedAt: dateNode.text().replace(/[\(\)]/g, ""),
      // We rebuild the url so it gets the full path
      url,
      shortUrl
    });
  });
  return chapters;
};

export const getWorkTitle = ($chapterIndexPage: ChapterIndexPage) => {
  return $chapterIndexPage(".works-navigate h2 a[href^='/works/']").text();
};

export const getWorkAuthors = (
  $chapterIndexPage: ChapterIndexPage
): Author[] => {
  const authors: Author[] = [];
  const authorNode = $chapterIndexPage(".works-navigate h2 a[rel='author']");
  if (authorNode.text().trim() === "Anonymous") {
    return [{ username: "Anonymous", pseud: "Anonymous", anonymous: true }];
  }

  if (authorNode.length !== 0) {
    authorNode.each((i, element) => {
      const url = element.attribs.href;
      const [, username, pseud] = url.match(/users\/(.+)\/pseuds\/(.+)/)!;

      authors.push({
        username: username,
        pseud: decodeURI(pseud),
        anonymous: false,
      });
    });
  }
  return authors;
};
