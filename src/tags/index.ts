import {
  getCanonical,
  getTagCategory,
  getTagPage,
  isCanonical,
  isCommon,
} from "./page-getters";
import {
  getTagFeedAtomPage,
  getTagId,
  getTagNameFromFeed,
  getTagWorksFeed,
} from "./works-feed-getters";

import { Tag } from "../types/entities";

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await getTagPage(tagName);
  const worksFeed = await getTagWorksFeed(tagName);

  return {
    name: tagName,
    id: getTagId(worksFeed),
    category: getTagCategory(tagPage),
    canonical: isCanonical(tagPage),
    common: isCommon(tagPage),
    canonicalName: getCanonical(tagPage),
  };
};

export const getTagNameById = async ({ tagId }: { tagId: string }) => {
  return getTagNameFromFeed(await getTagFeedAtomPage({ tagId }));
};
