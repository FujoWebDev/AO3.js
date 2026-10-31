/**
 * Rebuilds the paragraphs of a PDF, with their italics, bold, links, and
 * horizontal rules, as HTML or plain text. Nothing here is specific to AO3.
 *
 * A PDF only stores positioned pieces of text, so the text is rebuilt from
 * their positions:
 * - a paragraph ends where the gap to the next line is bigger than the usual
 *   line spacing (or at a page break, if the last line stops short)
 * - italics and bold come from the font of each piece
 * - links come from the PDF's link annotations, matched by position
 * - horizontal rules (scene breaks) are drawn as thin boxes
 */
import { getDocumentProxy } from "unpdf";
import { OPS } from "unpdf/pdfjs";
import { SAFE_LINK_SCHEME } from "../download-getters";

type PdfDocument = Awaited<ReturnType<typeof getDocumentProxy>>;
type PdfPage = Awaited<ReturnType<PdfDocument["getPage"]>>;
type PdfOperators = Awaited<ReturnType<PdfPage["getOperatorList"]>>;

// A stretch of text with one style
type TextRun = { text: string; italic: boolean; bold: boolean; href: string | null };

// One printed line of the PDF, with where it sits on the page
export type PdfLine =
  | {
    kind: "text";
    textRuns: TextRun[];
    text: string;
    // Distance from the previous line on the same page (0 for the first one)
    gapAbove: number;
    // How far the line reaches to the right, relative to the page's widest
    // line (1 = all the way). Short lines are the end of a paragraph.
    widthRatio: number;
    height: number;
  }
  | { kind: "rule" };

// A paragraph with its styled runs, or a horizontal rule
export type Paragraph = { kind: "paragraph"; textRuns: TextRun[] } | { kind: "rule" };

// Matrix math for the PDF's drawing operators, typed copies of pdf.js's
// Util.transform and Util.applyTransform (Apache-2.0, see
// licenses/LICENSE_PDFJS.md). applyToPoint returns a
// new point where pdf.js changes the one it's given.
type Matrix = [number, number, number, number, number, number];
const multiply = (m1: Matrix, m2: Matrix): Matrix => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
const applyToPoint = (m: Matrix, x: number, y: number) => ({
  x: m[0] * x + m[2] * y + m[4],
  y: m[1] * x + m[3] * y + m[5],
});

// pdf.js gives operator arguments and annotations are untyped, but
// we don't live like that.
const toNumbers = (value: unknown): number[] | null =>
  Array.isArray(value) || value instanceof Float32Array
    ? Array.from(value, Number)
    : null;

const isMatrix = (value: unknown): value is Matrix =>
  Array.isArray(value) &&
  value.length === 6 &&
  value.every((number) => typeof number === "number");

/**
 * Finds the horizontal rules drawn on a page. AO3's PDFs draw an <hr> as a
 * box one point tall, so this looks for any thin, wide filled shape and
 * returns the vertical position of each (rules a few points apart are the
 * same one).
 */
const findRules = (page: PdfPage, operators: PdfOperators) => {
  const { fnArray, argsArray } = operators;
  const pageWidth = page.view[2] - page.view[0];
  const ruleYs: number[] = [];

  let ctm: Matrix = [1, 0, 0, 1, 0, 0];
  const saved: Matrix[] = [];
  for (const [index, op] of fnArray.entries()) {
    const args: unknown = argsArray[index];
    if (op === OPS.save) {
      saved.push(ctm);
    } else if (op === OPS.restore) {
      ctm = saved.pop() ?? ctm;
    } else if (op === OPS.transform && isMatrix(args)) {
      ctm = multiply(ctm, args);
    } else if (op === OPS.constructPath && Array.isArray(args)) {
      // The last argument is the shape's bounding box: [minX, minY, maxX, maxY]
      const box = toNumbers(args[2]);
      if (!box || box.length < 4) {
        continue;
      }
      const [minX, minY, maxX, maxY] = box;
      const corner1 = applyToPoint(ctm, minX, minY);
      const corner2 = applyToPoint(ctm, maxX, maxY);
      const height = Math.abs(corner2.y - corner1.y);
      const width = Math.abs(corner2.x - corner1.x);
      if (height < 2 && width > pageWidth * 0.3) {
        const y = (corner1.y + corner2.y) / 2;
        if (!ruleYs.some((ruleY) => Math.abs(ruleY - y) < 4)) {
          ruleYs.push(y);
        }
      }
    }
  }
  return ruleYs;
};

/**
 * Tells italic and bold fonts apart by their names (like
 * "TimesNewRomanPS-BoldItalicMT"). pdf.js only loads a page's fonts when its
 * drawing operators are read, so call this after page.getOperatorList().
 */
const getFontStyles = (page: PdfPage, fontNames: string[]) => {
  const styles = new Map<string, { italic: boolean; bold: boolean }>();
  for (const fontName of fontNames) {
    const font: unknown = page.commonObjs.get(fontName);
    const name =
      typeof font === "object" && font !== null && "name" in font && typeof font.name === "string"
        ? font.name
        : "";
    styles.set(fontName, {
      italic: /italic|oblique/i.test(name),
      bold: /bold|black|heavy/i.test(name),
    });
  }
  return styles;
};

// Only web and email links: the HTML built from them is used as is, so a
// "javascript:" link in a PDF must not get through
const getLinks = async (page: PdfPage) => {
  const links: { url: string; rect: number[] }[] = [];
  for (const annotation of await page.getAnnotations()) {
    const url: unknown = annotation.url;
    const rect = toNumbers(annotation.rect);
    if (
      annotation.subtype === "Link" &&
      typeof url === "string" &&
      SAFE_LINK_SCHEME.test(url) &&
      rect?.length === 4
    ) {
      links.push({ url, rect });
    }
  }
  return links;
};

// Removes the whitespace at the start and end of a line's runs
const trimTextRuns = (textRuns: TextRun[]) => {
  const trimmed = textRuns.map((run) => ({ ...run }));
  const first = trimmed.find((run) => run.text.trim() !== "");
  const last = [...trimmed].reverse().find((run) => run.text.trim() !== "");
  if (first) {
    first.text = first.text.trimStart();
  }
  if (last) {
    last.text = last.text.trimEnd();
  }
  return trimmed.filter((run) => run.text !== "");
};

/**
 * Rebuilds the printed lines of a page from the PDF's text pieces. The pieces
 * come with their position, which is what tells wrapped lines apart from new
 * paragraphs later, and with their font, which gives italics and bold.
 */
const getPageLines = async (page: PdfPage): Promise<PdfLine[]> => {
  const { items } = await page.getTextContent();
  const textItems = items.flatMap((item) => ("str" in item ? [item] : []));
  // Reading the drawing operators also loads the page's fonts, so this comes
  // before getFontStyles
  const operators = await page.getOperatorList();
  const ruleYs = findRules(page, operators);
  const fontStyles = getFontStyles(page, [...new Set(textItems.map((item) => item.fontName))]);
  const links = await getLinks(page);

  const lines: { textRuns: TextRun[]; y: number; xEnd: number; height: number }[] = [];
  for (const item of textItems) {
    const x = item.transform[4];
    const y = item.transform[5];
    const xEnd = x + item.width;
    // A piece is a link if it sits inside a link annotation's box
    const link = links.find(
      ({ rect: [left, bottom, right, top] }) =>
        x + item.width / 2 >= left - 1 &&
        x + item.width / 2 <= right + 1 &&
        y >= bottom - 2 &&
        y <= top + 2,
    );
    const style = fontStyles.get(item.fontName) ?? { italic: false, bold: false };
    const run: TextRun = { text: item.str, ...style, href: link?.url ?? null };

    const current = lines.at(-1);
    // Pieces on the same vertical position belong to the same line
    if (current && Math.abs(current.y - y) < 1) {
      current.textRuns.push(run);
      current.xEnd = Math.max(current.xEnd, xEnd);
      current.height = Math.max(current.height, item.height);
    } else {
      lines.push({ textRuns: [run], y, xEnd, height: item.height });
    }
  }

  const printedLines = lines.filter((line) => line.textRuns.some((run) => run.text.trim() !== ""));
  const widestLine = Math.max(...printedLines.map((line) => line.xEnd), 1);

  const pdfLines: PdfLine[] = [];
  let previousY: number | null = null;
  for (const line of printedLines) {
    // Rules sit between lines: add the ones above this line first
    ruleYs
      .filter((y) => y > line.y && (previousY === null || y < previousY))
      .forEach(() => pdfLines.push({ kind: "rule" }));
    pdfLines.push({
      kind: "text",
      textRuns: trimTextRuns(line.textRuns),
      text: line.textRuns
        .map((run) => run.text)
        .join("")
        .trim(),
      gapAbove: previousY === null ? 0 : previousY - line.y,
      widthRatio: line.xEnd / widestLine,
      height: line.height,
    });
    previousY = line.y;
  }
  return pdfLines;
};

/**
 * Reads every page of a PDF as its printed lines.
 */
export const getPdfPages = async (pdf: Uint8Array) => {
  let document;
  try {
    document = await getDocumentProxy(
      // pdf.js takes ownership of the bytes it's given, so pass a copy
      new Uint8Array(pdf),
      // Needed to get the fonts' names, which tell what's italic or bold
      { fontExtraProperties: true },
    );
  } catch (error) {
    throw new Error("Couldn't open the file as a PDF", { cause: error });
  }
  const pages: PdfLine[][] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    pages.push(await getPageLines(await document.getPage(pageNumber)));
  }
  return pages;
};

/**
 * Glues wrapped lines back into paragraphs. A new paragraph starts after a gap
 * bigger than the usual line spacing, and after a page break if the last line
 * of the page before stopped short of the right margin.
 */
export const toParagraphs = (pages: PdfLine[][]) => {
  const paragraphs: Paragraph[] = [];
  let current: TextRun[] = [];
  let lastLine: PdfLine | null = null;
  const closeParagraph = () => {
    if (current.length > 0) {
      paragraphs.push({ kind: "paragraph", textRuns: current });
      current = [];
    }
  };

  for (const page of pages) {
    if (lastLine?.kind === "text" && lastLine.widthRatio < 0.85) {
      closeParagraph();
    }
    for (const [index, line] of page.entries()) {
      if (line.kind === "rule") {
        closeParagraph();
        paragraphs.push({ kind: "rule" });
        continue;
      }
      if (index > 0 && line.gapAbove > line.height * 1.5) {
        closeParagraph();
      }
      const lastTextRun = current.at(-1);
      if (lastTextRun) {
        // A wrapped line continues the paragraph after a space
        current.push({ ...lastTextRun, text: " " });
      }
      current.push(...line.textRuns);
      lastLine = line;
    }
  }
  closeParagraph();
  return paragraphs;
};

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const sameStyle = (a: TextRun, b: TextRun) =>
  a.italic === b.italic && a.bold === b.bold && a.href === b.href;

// Turns runs into HTML, wrapping each stretch of the same style once
const textRunsToHtml = (textRuns: TextRun[]) => {
  const merged: TextRun[] = [];
  for (const run of textRuns) {
    const last = merged.at(-1);
    if (last && sameStyle(last, run)) {
      last.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }
  return merged
    .map((run) => {
      // Keep the spaces around a run outside its tags
      const core = run.text.trim();
      const before = run.text.slice(0, run.text.length - run.text.trimStart().length);
      const after = run.text.slice(run.text.trimEnd().length);
      let html = escapeHtml(core);
      if (run.italic) {
        html = `<em>${html}</em>`;
      }
      if (run.bold) {
        html = `<strong>${html}</strong>`;
      }
      if (run.href) {
        html = `<a href="${escapeHtml(run.href)}">${html}</a>`;
      }
      return `${before}${html}${after}`;
    })
    .join("");
};

export const paragraphText = (paragraph: Paragraph) =>
  paragraph.kind === "rule" ? "" : paragraph.textRuns.map((run) => run.text).join("");

export const toHtml = (paragraphs: Paragraph[]) =>
  paragraphs
    .map((paragraph) =>
      paragraph.kind === "rule" ? "<hr>" : `<p>${textRunsToHtml(paragraph.textRuns)}</p>`,
    )
    .join("\n");

export const toText = (paragraphs: Paragraph[]) =>
  paragraphs
    .filter((paragraph) => paragraph.kind === "paragraph")
    .map(paragraphText)
    .join("\n\n");

// The text of a page's lines, without the horizontal rules
export const lineTexts = (page: PdfLine[]) =>
  page.flatMap((line) => (line.kind === "text" ? [line.text] : []));
