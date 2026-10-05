import { ArchiveId } from "types/entities";

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
