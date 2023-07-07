import cheerio, { CheerioAPI } from "cheerio";

import { WorkPage } from "../types/pages";
import axios from "axios";
import { getWorkUrl } from "./tag-works";

export interface Work {
  locked: boolean;
}

export const getWorkPage = async ({ workId }: { workId: string }) => {
  return cheerio.load(
    (await axios.get<string>(getWorkUrl({ workId }))).data
  ) as WorkPage;
};

export const getWorkLocked = ($workPage: WorkPage) => {
  return !!$workPage("#signin > .heading").text();
};
