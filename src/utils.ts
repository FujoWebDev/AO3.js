import { ArchiveId } from "types/entities";

export const parseId = (id:ArchiveId): number => typeof id === 'number' ? id : parseInt(id, 10);
