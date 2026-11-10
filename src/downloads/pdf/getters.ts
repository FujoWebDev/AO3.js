/**
 * Every work downloaded from AO3 as a PDF starts with the same preface: the
 * title, a "Posted originally on the Archive of Our Own at ..." line, the
 * tags, and a "Stats:" line. The next page repeats the title with the byline,
 * the summary, and the author's notes. Each chapter then starts on its own
 * page with a "Chapter N: Title" line, or with just its title, printed bigger
 * than the text.
 *
 * Older PDFs don't give the title, byline, summary and notes their own page:
 * they come right after the tags, and the text right after them.
 * withPrefaceOnItsOwnPage makes those look like the newer ones, so the other
 * getters only have to read one layout. Checking what they read happens in
 * toDownloadedWork.
 */
import { PREFACE_LABELS, type DownloadData, type PrefaceField } from "../download-getters";
import {
  lineTexts,
  paragraphText,
  toHtml,
  toParagraphs,
  type Paragraph,
  type PdfLine,
} from "./document";

// A preface line starting with one of AO3's labels, like "Fandoms: ..."
const LABEL_LINE = new RegExp(`^(${Object.values(PREFACE_LABELS).flat().join("|")}): ?(.*)$`);

// The "by ..." line under the title on the preface page
const BYLINE = /^by\s+\S/;

// Older PDFs say "http://" instead of "https://"
const WORK_URL = /https?:\/\/archiveofourown\.org\/works\/\d+/;

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
// The headings AO3 prints above the text: the work's on the preface page, and
// each chapter's on its first page
const PREFACE_HEADINGS = ["Summary", "Notes"];
const CHAPTER_PREFACE_HEADINGS = ["Chapter Summary", "Chapter Notes"];
const SEE_END_NOTES = /^See the end of the (?:work|chapter) for (?:more )?notes\.?$/;
// Older PDFs say "the archive", lowercase
const AFTERWORD_TEXT = /^Please drop by the Archive and comment/i;

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
  };
};

/**
 * AO3 doesn't put a heading between a summary or notes and the text after
 * them, only a gap much taller than the ones between paragraphs. This returns
 * the index of the first line of the text, looking from `fromIndex` on, or the
 * page's length if the text doesn't start on this page. The first line under
 * each heading is skipped, since there's always a big gap between a heading
 * and what it heads.
 */
const findTextStart = (lines: PdfLine[], fromIndex: number, headings: string[]) => {
  let isFirstLineOfSection = false;
  for (let index = fromIndex; index < lines.length; index++) {
    const line = lines[index];
    if (line.kind !== "text") {
      continue;
    }
    if (headings.includes(line.text)) {
      isFirstLineOfSection = true;
      continue;
    }
    if (!isFirstLineOfSection && line.gapAbove > line.height * 3) {
      return index;
    }
    isFirstLineOfSection = false;
  }
  return lines.length;
};

/**
 * Older PDFs print the preface (title, byline, summary, notes) right after
 * the tags on the first page, and the text right after it. This splits that
 * first page in three (tags, preface, text), so these PDFs look like the newer
 * ones to the rest of the getters. PDFs with a preface page are left as is.
 */
const withPrefaceOnItsOwnPage = (pages: PdfLine[][]) => {
  const hasPrefacePage = pages.some(
    (page, index) => index > 0 && lineTexts(page).slice(0, 3).some((line) => BYLINE.test(line)),
  );
  const [firstPage, ...otherPages] = pages;
  if (hasPrefacePage || !firstPage) {
    return pages;
  }
  const isText = (line: PdfLine): line is Extract<PdfLine, { kind: "text" }> => line.kind === "text";
  const postedLineIndex = firstPage.findIndex((line) => isText(line) && WORK_URL.test(line.text));
  const bylineIndex = firstPage.findIndex(
    (line, index) => index > postedLineIndex && isText(line) && BYLINE.test(line.text),
  );
  if (postedLineIndex === -1 || bylineIndex < 1) {
    return pages;
  }
  // The title is printed again right above the byline
  const prefaceStart = bylineIndex - 1;
  const textStart = findTextStart(firstPage, bylineIndex + 1, PREFACE_HEADINGS);
  const textOnFirstPage = firstPage.slice(textStart);
  return [
    firstPage.slice(0, prefaceStart),
    firstPage.slice(prefaceStart, textStart),
    ...(textOnFirstPage.length > 0 ? [textOnFirstPage] : []),
    ...otherPages,
  ];
};

/**
 * The height most of the text is printed at, which is the text of the work.
 * Chapter titles are printed bigger than that.
 */
const getBodyTextHeight = (pages: PdfLine[][]) => {
  const counts = new Map<number, number>();
  for (const page of pages) {
    for (const line of page) {
      if (line.kind === "text") {
        const height = Math.round(line.height * 10) / 10;
        counts.set(height, (counts.get(height) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
};

/**
 * Some PDFs start each chapter with a "Chapter N: Title" line, others with
 * just the title, printed bigger than the text. Long titles wrap onto more
 * than one line, so every big line at the top of the page is part of it.
 */
const getChapterHeading = (page: PdfLine[], bodyTextHeight: number) => {
  const firstLine = page[0];
  if (firstLine?.kind !== "text") {
    return null;
  }
  const numbered = firstLine.text.match(CHAPTER_HEADING);
  if (numbered) {
    // Give untitled chapters the same "Chapter N" heading EPUBs have
    return { heading: numbered[2] ?? `Chapter ${numbered[1]}`, lineCount: 1 };
  }
  const isBig = (line: PdfLine | undefined) =>
    line?.kind === "text" && line.height > bodyTextHeight * 1.2;
  let lineCount = 0;
  while (isBig(page[lineCount])) {
    lineCount++;
  }
  if (lineCount === 0) {
    return null;
  }
  return { heading: lineTexts(page.slice(0, lineCount)).join(" "), lineCount };
};

/**
 * Reads the chapters from the pages after the preface. Each chapter starts on
 * its own page with a heading (see getChapterHeading); works with a single
 * chapter have no heading and are one untitled chapter.
 */
const getChapters = (pages: PdfLine[][]) => {
  const chapterPages: { heading: string; pages: PdfLine[][] }[] = [];
  const bodyTextHeight = getBodyTextHeight(pages);
  for (const page of pages) {
    const heading = getChapterHeading(page, bodyTextHeight);
    const current = chapterPages.at(-1);
    if (heading) {
      chapterPages.push({ heading: heading.heading, pages: [page.slice(heading.lineCount)] });
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
    // A chapter's summary and notes come before its text, with no heading in
    // between, so they're read apart from it
    const [firstPage = [], ...otherPages] = chapter.pages;
    const firstText = firstPage.find((line) => line.kind === "text");
    const startsWithPreface =
      firstText?.kind === "text" && CHAPTER_PREFACE_HEADINGS.includes(firstText.text);
    const textStart = startsWithPreface ? findTextStart(firstPage, 0, CHAPTER_PREFACE_HEADINGS) : 0;
    const preface = bySection(toParagraphs([firstPage.slice(0, textStart)]), SECTION_HEADINGS);
    const sections = bySection(
      toParagraphs([firstPage.slice(textStart), ...otherPages]),
      SECTION_HEADINGS,
    );
    if (position === chapterPages.length - 1) {
      endNotes = sections.html("End Notes");
    }
    return {
      heading: chapter.heading,
      summary: preface.html("Chapter Summary") ?? sections.html("Chapter Summary"),
      notes: {
        start: preface.html("Chapter Notes") ?? sections.html("Chapter Notes"),
        end: sections.html("Chapter End Notes"),
      },
      html: sections.html("text") ?? "",
    };
  });
  return { chapters, endNotes };
};

export const getPdfWorkData = (allPages: PdfLine[][]): DownloadData => {
  const pages = withPrefaceOnItsOwnPage(allPages);
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
  const preface = bySection(toParagraphs([prefacePage]), PREFACE_HEADINGS);
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
