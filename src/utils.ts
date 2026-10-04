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
