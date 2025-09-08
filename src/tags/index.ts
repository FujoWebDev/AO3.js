import { isValidArchiveIdOrNullish, parseArchiveId } from "src/utils";
import {
  getCanonical,
  getTagCategory,
  isCanonical,
  isCommon,
  getParentTags,
  getChildTags,
  getSubTags,
} from "./page-getters";
import { getTagId, getTagNameFromFeed } from "./works-feed-getters";
import {
  loadTagFeedAtomPage,
  loadTagPage,
  loadTagWorksFeed,
} from "src/page-loaders";

import type { Tag } from "types/entities";

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await loadTagPage({ tagName });
  const worksFeed = await loadTagWorksFeed({ tagName });

  const tagId = getTagId(worksFeed);
  if (!isValidArchiveIdOrNullish(tagId)) {
    throw new Error(`Found invalid tag id: ${tagId}`);
  }

  return {
    name: tagName,
    id: tagId && parseArchiveId(tagId),
    category: getTagCategory(tagPage),
    canonical: isCanonical(tagPage),
    common: isCommon(tagPage),
    canonicalName: getCanonical(tagPage),
    parentTags: getParentTags(tagPage),
    childTags: getChildTags(tagPage),
    subTags: getSubTags(tagPage),
  };
};

export const getTagNameById = async ({ tagId }: { tagId: string }) => {
  return getTagNameFromFeed(await loadTagFeedAtomPage({ tagId }));
};
