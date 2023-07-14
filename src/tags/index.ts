import {
  getCanonical,
  getTagCategory,
  isCanonical,
  isCommon,
  loadTagPage,
} from "./page-getters";
import {
  getTagId,
  getTagNameFromFeed,
  loadTagFeedAtomPage,
  loadTagWorksFeed,
} from "./works-feed-getters";

import { Tag } from "../types/entities";

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await loadTagPage(tagName);
  const worksFeed = await loadTagWorksFeed(tagName);

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
  return getTagNameFromFeed(await loadTagFeedAtomPage({ tagId }));
};
