import { ID } from "types/entities";

export const parseId = (id:ID):number => typeof id === 'number' ? id : parseInt(id, 10);
