/**
 * AO3 makes its EPUBs from the same HTML as its HTML downloads, so the EPUB
 * holds the work's page almost as is.
 */
import { load, type CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import {
  PREFACE_LABELS,
  SAFE_LINK_SCHEME,
  type DownloadData,
  type PrefaceField,
} from "../download-getters";

const cleanText = (text: string) => text.replace(/\s+/g, " ").trim();

const copyOf = ($: CheerioAPI, elements: AnyNode[]) => {
  const $copy = load("<div></div>");
  const copy = $copy("div");
  copy.append($(elements).clone());
  return { $copy, copy };
};

/**
 * The HTML of the work's text and notes, without the EPUB's styling. No
 * classes or ids, only links to web pages, and no "See the end of the
 * chapter for more notes" links. Embedded videos keep their address.
 */
const toHtml = ($: CheerioAPI, elements: AnyNode[]) => {
  const { $copy, copy } = copyOf($, elements);
  copy.find(".endnote-link").remove();
  copy.find("*").each((_, element) => {
    const $element = $copy(element);
    const href = $element.attr("href");
    const src = $element.attr("src");
    const alt = $element.attr("alt");
    for (const name of Object.keys(element.attribs)) {
      $element.removeAttr(name);
    }
    if (element.name === "a") {
      if (href && SAFE_LINK_SCHEME.test(href)) {
        $element.attr("href", href);
      } else {
        $element.replaceWith($element.contents());
      }
    }
    if (element.name === "img" && src) {
      $element.attr("src", src);
      if (alt !== undefined) {
        $element.attr("alt", alt);
      }
    }
    if (element.name === "iframe" && src?.startsWith("https:")) {
      $element.attr("src", src);
    }
  });
  return (copy.html() ?? "").trim();
};

/**
 * The work's text as plain text: each paragraph (or heading, or list item)
 * on its own, separated by blank lines, and line breaks kept.
 */
const toText = ($: CheerioAPI, elements: AnyNode[]) => {
  const { $copy, copy } = copyOf($, elements);
  copy.find("br").replaceWith("\n");
  const BLOCKS = "p, h1, h2, h3, h4, h5, h6, li, pre";
  return copy
    .find(BLOCKS)
    .filter((_, block) => $copy(block).find(BLOCKS).length === 0)
    .toArray()
    .map((block) => $copy(block).text().split("\n").map(cleanText).join("\n").trim())
    .filter((text) => text !== "")
    .join("\n\n");
};

const getNotesAfter = ($: CheerioAPI, scope: AnyNode[], label: string) => {
  const labelParagraph = $(scope)
    .find("p")
    .filter(
      (_, paragraph) =>
        cleanText($(paragraph).text()) === label &&
        $(paragraph).closest("blockquote").length === 0,
    )
    .first();
  const notes = labelParagraph.nextAll("blockquote").first();
  return notes.length > 0 ? toHtml($, notes.contents().toArray()) : null;
};

const getPrefaceTags = ($: CheerioAPI) => {
  const tags = new Map<string, string[]>();
  $("#preface dl.tags dt").each((_, term) => {
    const label = cleanText($(term).text()).replace(/:$/, "");
    const definition = $(term).next("dd");
    const links = definition.find("a").toArray();
    tags.set(
      label,
      links.length > 0
        ? links.map((link) => cleanText($(link).text()))
        : [cleanText(definition.text())],
    );
  });
  return (name: PrefaceField) =>
    PREFACE_LABELS[name].map((label) => tags.get(label)).find((values) => values !== undefined);
};

/**
 * Each chapter's summary and notes are in the same box as its heading, 
 * then comes its text, then its end notes (in a box with an
 * "endnotesN" id).
 */
const getChapters = ($: CheerioAPI): DownloadData["chapters"] => {
  const chapters: {
    heading: string;
    meta: AnyNode[];
    text: AnyNode[];
    endNotes: AnyNode[];
  }[] = [];
  for (const part of $("#chapters").children().toArray()) {
    const $part = $(part);
    const heading = $part.is("h2") ? $part : $part.find("h2");
    const current = chapters.at(-1);
    if (heading.length > 0) {
      chapters.push({ heading: cleanText(heading.text()), meta: [part], text: [], endNotes: [] });
    } else if ($part.attr("id")?.startsWith("endnotes")) {
      current?.endNotes.push(part);
    } else if (current) {
      current.text.push(...$part.contents().toArray());
    }
  }

  return chapters.map((chapter) => ({
    heading: chapter.heading,
    summary: getNotesAfter($, chapter.meta, "Chapter Summary"),
    notes: getNotesAfter($, chapter.meta, "Chapter Notes"),
    html: toHtml($, chapter.text),
    text: toText($, chapter.text),
    endNotes: getNotesAfter($, chapter.endNotes, "Chapter End Notes"),
  }));
};

export const getEpubWorkData = ($: CheerioAPI, packageLanguage: string): DownloadData => {
  const tag = getPrefaceTags($);
  const preface = $("#preface").toArray();
  return {
    format: "epub",
    workUrls: $("#preface .message a")
      .toArray()
      .flatMap((link) => $(link).attr("href") ?? []),
    title: cleanText($("#preface h1").first().text()),
    byline: cleanText($("#preface .byline").text()).replace(/^by\s+/, ""),
    authorUrls: $("#preface .byline a[rel=author]")
      .toArray()
      .flatMap((link) => $(link).attr("href") ?? []),
    rating: tag("rating")?.[0],
    warnings: tag("warnings") ?? [],
    categories: tag("categories"),
    fandoms: tag("fandoms") ?? [],
    relationships: tag("relationships") ?? [],
    characters: tag("characters") ?? [],
    additional: tag("additional") ?? [],
    languageName: tag("language")?.[0],
    languageCode: packageLanguage === "" ? undefined : packageLanguage,
    stats: tag("stats")?.[0],
    summary: getNotesAfter($, preface, "Summary"),
    startNotes: getNotesAfter($, preface, "Notes"),
    chapters: getChapters($),
    endNotes: getNotesAfter($, $("#afterword").toArray(), "End Notes"),
  };
};
