import { convert, type HtmlToTextOptions } from "html-to-text";
import { ArchiveId } from "types/entities";

export const cleanText = (text: string) => text.replace(/\s+/g, " ").trim();

// Every block is its own paragraph, including text AO3 keeps outside a <p>
// (older works often put bare text in <div>s). Scene-break <hr>s become a
// "---" line, and images are left out.
const SCENE_BREAK = "---";
const PARAGRAPH = {
  format: "block",
  options: { leadingLineBreaks: 2, trailingLineBreaks: 2 },
};
const TEXT_OPTIONS: HtmlToTextOptions = {
  wordwrap: false,
  selectors: [
    { selector: "a", options: { ignoreHref: true } },
    { selector: "img", format: "skip" },
    { selector: "hr", format: "blockString", options: { string: SCENE_BREAK } },
    ...["h1", "h2", "h3", "h4", "h5", "h6"].map((selector) => ({
      selector,
      options: { uppercase: false },
    })),
    { selector: "ul", options: { itemPrefix: "- " } },
    ...["div", "blockquote", "center", "table", "tr", "td", "th"].map(
      (selector) => ({ selector, ...PARAGRAPH }),
    ),
  ],
};

/**
 * A work's HTML as plain text: paragraphs separated by blank lines, line
 * breaks kept, and formatting like bold or links reduced to their words.
 */
export const toPlainText = ({ html }: { html: string }) =>
  convert(html, TEXT_OPTIONS)
    .split("\n")
    .map(cleanText)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const parseArchiveId = (id: string | number): ArchiveId =>
  typeof id === "number" ? id : parseInt(id, 10);

export const isValidArchiveId = (id: string | number): id is ArchiveId =>
  parseArchiveId(id) == id;

export const isValidArchiveIdOrNullish = <
  T extends string | number | null | undefined
>(
  id: T
): id is Exclude<T, string> =>
  typeof id === "undefined" || id === null || parseArchiveId(id) == id;

// Lets TypeScript know an array has at least one item
export const isNonEmpty = <T>(items: T[]): items is [T, ...T[]] =>
  items.length > 0;

export class InvalidIDError extends Error {
  message: string;

  constructor(id: string | number, type: "work" | "chapter" | "series") {
    super();
    this.message = `${id} is not a valid ${type} id`;
  }
}

export class ArchivePageRequestError extends Error {
  message: string;
  status: number;
  url: string;

  constructor({ url, status }: { url: string; status: number }) {
    super();
    this.message = `Archive request failed with status ${status}: ${url}`;
    this.status = status;
    this.url = url;
  }
}

const MONTHS: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// AO3 blurbs (works, series, bookmarks) show dates like "01 Jan 2026";
// returns "2026-01-01".
export const parseBlurbDate = (text: string) => {
  const [day, month, year] = text.trim().split(/\s+/);
  if (!day || !MONTHS[month] || !year) {
    throw new Error(`Unexpected work blurb date: ${text}`);
  }
  return `${year}-${MONTHS[month]}-${day.padStart(2, "0")}`;
};
