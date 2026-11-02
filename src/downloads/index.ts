import type { DownloadedWork } from "types/entities";
import { toDownloadedWork } from "./download-getters";
import { getEpubBody } from "./epub/container";
import { getEpubWorkData } from "./epub/getters";

/**
 * Reads a work's metadata and text from an EPUB downloaded from AO3.
 *
 * Kudos, hits, and bookmarks aren't in the EPUB, so the work has no stats.
 * Pass `filePath` to keep it on the work's `file`.
 */
export const parseEpubWork = ({
  epub,
  filePath = null,
}: {
  epub: Uint8Array;
  filePath?: string | null;
}): DownloadedWork => {
  const { $, language } = getEpubBody(epub);
  return toDownloadedWork(getEpubWorkData($, language), filePath);
};

/**
 * Loads the PDF reader only when a PDF is read, so `unpdf` is only needed by
 * those who read PDFs.
 */
const loadPdfReader = async () => {
  try {
    const [{ getPdfPages }, { getPdfWorkData }] = await Promise.all([
      import("./pdf/document"),
      import("./pdf/getters"),
    ]);
    return { getPdfPages, getPdfWorkData };
  } catch (error) {
    throw new Error("parsePdfWork needs the `unpdf` package. Install it with `npm install unpdf`.", {
      cause: error,
    });
  }
};

/**
 * Reads a work's metadata and text from a PDF downloaded from AO3. Needs the
 * `unpdf` package installed. Pass `filePath` to keep it on the work's `file`.
 *
 * PDFs only store positioned text, so paragraphs, italics, bold, links, and
 * scene breaks are rebuilt from the layout. EPUB, instead, is a sensible format
 * for sensible humans.
 */
export const parsePdfWork = async ({
  pdf,
  filePath = null,
}: {
  pdf: Uint8Array;
  filePath?: string | null;
}): Promise<DownloadedWork> => {
  const { getPdfPages, getPdfWorkData } = await loadPdfReader();
  return toDownloadedWork(getPdfWorkData(await getPdfPages(pdf)), filePath);
};
