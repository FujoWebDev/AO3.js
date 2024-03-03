import {
  Prompt
} from "types/entities"

import {
  getPostedAt,
  getPromptSummary,
  getCollectionDisplayTitle,
  getPromptRatings,
  getPromptAuthor,
  getPromptFandoms,
  getPromptAdditionalTags,
  getPromptCharacters,
  getPromptRelationships,
  getPromptWarnings
} from "./prompt-getters"

import {loadPromptPage} from "../../page-loaders"

export const getPrompt = async ({
  promptId,
  collectionName,
}: {
  promptId: string;
  collectionName: string;
}): Promise<Prompt> => {

  const promptPage = await loadPromptPage({id: promptId, collectionName: collectionName});//TODO

  return {
    postedAt: getPostedAt(promptPage),
    summary: getPromptSummary(promptPage),
    collectionDisplayTitle: getCollectionDisplayTitle(promptPage),
    ratings: getPromptRatings(promptPage),
    author: getPromptAuthor(promptPage),
    fandoms: getPromptFandoms(promptPage),
    tags: {
      warnings: getPromptWarnings(promptPage),
      characters: getPromptCharacters(promptPage),
      relationships: getPromptRelationships(promptPage),
      additional: getPromptAdditionalTags(promptPage)
    }
  }

}