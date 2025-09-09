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
