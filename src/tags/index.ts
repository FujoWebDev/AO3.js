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
  loadTagSearchPage,
  loadTagWorksFeed,
} from "src/page-loaders";

import type {
  Tag,
  TagSearchFilters,
  TagSearchResultSummary,
} from "types/entities";
import {
  getPagesCount,
  getTagsSearchResults,
  getTotalResults,
} from "./search-getters";

export const searchTags = async (
  tagSearchFilters: Partial<TagSearchFilters>
): Promise<TagSearchResultSummary> => {
  // We normalize the filters to ensure they have the required properties.
  const normalizedFilters: TagSearchFilters = {
    tagName: tagSearchFilters.tagName ?? null,
    fandoms: tagSearchFilters.fandoms ?? [],
    type: tagSearchFilters.type ?? "any",
    wranglingStatus: tagSearchFilters.wranglingStatus ?? "any",
    sortColumn: tagSearchFilters.sortColumn ?? "name",
    sortDirection: tagSearchFilters.sortDirection ?? "asc",
    page: tagSearchFilters.page ?? 1,
  };

  const page = await loadTagSearchPage({ tagSearchFilters: normalizedFilters });

  return {
    // We return the filters as is because they are already normalized
    // and the API expects them to be in this format.
    filters: normalizedFilters,
    totalResults: getTotalResults(page),
    pages: {
      total: getPagesCount(page),
      current: normalizedFilters.page,
    },
    tags: getTagsSearchResults(page),
  };
};

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

// TODO: this is really getCanonicalTagNameById
export const getTagNameById = async ({ tagId }: { tagId: string }) => {
  return getTagNameFromFeed(await loadTagFeedAtomPage({ tagId }));
};
