/**
 * Every work downloaded from AO3 as a PDF starts with the same preface: the
 * title, a "Posted originally on the Archive of Our Own at ..." line, the
 * tags, and a "Stats:" line. The next page repeats the title with the byline,
 * the summary, and the author's notes. Each chapter then starts on its own
 * page with a "Chapter N: Title" line.
 *
 * These getters read that layout as is. Checking what they read happens in
 * toDownloadedWork.
 */
import { PREFACE_LABELS, type DownloadData, type PrefaceField } from "../download-getters";
import {
  lineTexts,
  paragraphText,
  toHtml,
  toParagraphs,
  toText,
  type Paragraph,
  type PdfLine,
} from "./document";

// A preface line starting with one of AO3's labels, like "Fandoms: ..."
const LABEL_LINE = new RegExp(`^(${Object.values(PREFACE_LABELS).flat().join("|")}): ?(.*)$`);

// The "by ..." line under the title on the preface page
const BYLINE = /^by\s+\S/;

const WORK_URL = /https:\/\/archiveofourown\.org\/works\/\d+/;

const CHAPTER_HEADING = /^Chapter (\d+)(?:: (.*))?$/;

// The headings AO3 prints inside a chapter, and after the last one
const SECTION_HEADINGS = [
  "Chapter Summary",
  "Chapter Notes",
  "Chapter End Notes",
  "End Notes",
  "Afterword",
  "Works inspired by this one",
];
const SEE_END_NOTES = /^See the end of the (?:work|chapter) for (?:more )?notes\.?$/;
const AFTERWORD_TEXT = /^Please drop by the Archive and comment/;

// Splits "a, b, c" into ["a", "b", "c"]. AO3 doesn't allow commas inside tags.
const asList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

/**
 * Turns the lines of the first page(s) into a label -> value map. Long values
 * wrap onto the following lines, which don't start with a label, so those get
 * glued back onto the value before them.
 */
const getLabeledFields = (lines: string[]) => {
  const fields = new Map<string, string>();
  let currentLabel: string | null = null;
  for (const line of lines) {
    const match = line.match(LABEL_LINE);
    if (match) {
      currentLabel = match[1];
      fields.set(currentLabel, match[2].trim());
    } else if (currentLabel) {
      fields.set(currentLabel, `${fields.get(currentLabel)} ${line}`.trim());
    }
  }
  return (name: PrefaceField) =>
    PREFACE_LABELS[name].map((label) => fields.get(label)).find((value) => value !== undefined);
};

/**
 * Splits paragraphs into the sections AO3 prints: the text itself, and
 * whatever "Summary", "Chapter Notes", ... headings come with it.
 */
const bySection = (paragraphs: Paragraph[], headings: string[]) => {
  const sections = new Map<string, Paragraph[]>();
  let currentSection = "text";
  for (const paragraph of paragraphs) {
    const text = paragraphText(paragraph);
    if (headings.includes(text)) {
      currentSection = text;
    } else if (!SEE_END_NOTES.test(text) && !AFTERWORD_TEXT.test(text)) {
      sections.set(currentSection, [...(sections.get(currentSection) ?? []), paragraph]);
    }
  }
  return {
    html: (section: string) => {
      const found = sections.get(section);
      return found ? toHtml(found) : null;
    },
    text: (section: string) => {
      const found = sections.get(section);
      return found ? toText(found) : null;
    },
  };
};

/**
 * Reads the chapters from the pages after the preface. Each chapter starts on
 * its own page with a "Chapter N: Title" line; works with a single chapter
 * have no such line and are one untitled chapter.
 */
const getChapters = (pages: PdfLine[][]) => {
  const chapterPages: { heading: string; pages: PdfLine[][] }[] = [];
  for (const page of pages) {
    const firstLine = page[0];
    const heading = firstLine?.kind === "text" ? firstLine.text.match(CHAPTER_HEADING) : null;
    const current = chapterPages.at(-1);
    if (heading) {
      // Give untitled chapters the same "Chapter N" heading EPUBs have
      chapterPages.push({ heading: heading[2] ?? `Chapter ${heading[1]}`, pages: [page.slice(1)] });
    } else if (current) {
      current.pages.push(page);
    } else {
      chapterPages.push({ heading: "Chapter 1", pages: [page] });
    }
  }

  // The work's end notes are printed after the last chapter's text, so they
  // end up in the last chapter's sections
  let endNotes: string | null = null;
  const chapters = chapterPages.map((chapter, position) => {
    const sections = bySection(toParagraphs(chapter.pages), SECTION_HEADINGS);
    if (position === chapterPages.length - 1) {
      endNotes = sections.html("End Notes");
    }
    return {
      heading: chapter.heading,
      summary: sections.html("Chapter Summary"),
      notes: sections.html("Chapter Notes"),
      html: sections.html("text") ?? "",
      text: sections.text("text") ?? "",
      endNotes: sections.html("Chapter End Notes"),
    };
  });
  return { chapters, endNotes };
};

export const getPdfWorkData = (pages: PdfLine[][]): DownloadData => {
  // The preface page starts with the title and a "by ..." line. The metadata
  // is on every page before it (usually one, more with a long tag list).
  const prefaceIndex = pages.findIndex(
    (page, index) => index > 0 && lineTexts(page).slice(0, 3).some((line) => BYLINE.test(line)),
  );
  const metadataPages = prefaceIndex === -1 ? pages.slice(0, 1) : pages.slice(0, prefaceIndex);
  const metadataLines = metadataPages.flatMap(lineTexts);
  const postedLineIndex = metadataLines.findIndex((line) => WORK_URL.test(line));
  const field = getLabeledFields(metadataLines.slice(postedLineIndex + 1));
  const prefacePage = prefaceIndex === -1 ? [] : pages[prefaceIndex];
  const preface = bySection(toParagraphs([prefacePage]), ["Summary", "Notes"]);
  const { chapters, endNotes } = getChapters(prefaceIndex === -1 ? [] : pages.slice(prefaceIndex + 1));
  const categories = field("categories");

  return {
    format: "pdf",
    workUrls: metadataLines.flatMap((line) => line.match(WORK_URL)?.[0] ?? []),
    title: postedLineIndex === -1 ? "" : metadataLines.slice(0, postedLineIndex).join(" "),
    byline: (lineTexts(prefacePage).find((line) => BYLINE.test(line)) ?? "").replace(/^by\s+/, ""),
    // PDFs have no author links, only the byline's text
    authorUrls: [],
    rating: field("rating"),
    warnings: asList(field("warnings")),
    categories: categories === undefined ? undefined : asList(categories),
    fandoms: asList(field("fandoms")),
    relationships: asList(field("relationships")),
    characters: asList(field("characters")),
    additional: asList(field("additional")),
    languageName: field("language"),
    languageCode: undefined,
    stats: field("stats"),
    summary: preface.html("Summary"),
    startNotes: preface.html("Notes"),
    chapters,
    endNotes,
  };
};
