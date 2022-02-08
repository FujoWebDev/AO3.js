import {
  Tag,
  getCanonical,
  getTagCategory,
  getTagPage,
  isCanonical,
  isCommon,
} from "./utils/tags";
import { getFeedPage, getTagNameFromFeed } from "./utils/feed";
import { getTagId, getWorksPage } from "./utils/works";
import { 
 getProfile, 
 getProfileLink, 
 getProfileName, 
 getProfilePseuds,
 getProfileJoined,
 getProfileID,
 getProfileBio
} from "./utils/user";

import axios from "axios";
import { setupCache } from "axios-cache-adapter";

axios.defaults.cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

export const getTag = async ({
  tagName,
}: {
  tagName: string;
}): Promise<Tag> => {
  const tagPage = await getTagPage(tagName);
  const worksPage = await getWorksPage(tagName);

  return {
    name: tagName,
    id: getTagId(worksPage),
    category: getTagCategory(tagPage),
    canonical: isCanonical(tagPage),
    common: isCommon(tagPage),
    canonicalName: getCanonical(tagPage),
  };
};

export const getTagNameById = async ({ tagId }: { tagId: string }) => {
  return getTagNameFromFeed(await getFeedPage({ tagId }));
};

export const getUser = async ({
 userName,
}: {
 userName: string;
}): Promise<typeof getProfile> => {

//Need help getting this to work I think
 return {
   name: getProfileName,
   pseuds: getProfilePseuds,
   url: getProfileLink,
   id: getProfileID,
   joined: getProfileJoined,
   bio: getProfileBio,
 };
};
