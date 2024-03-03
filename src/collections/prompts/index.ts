import {
  Prompt
} from "types/entities"

import {
  getUpdatedAt,
  getPromptSummary,
  getCollectionDisplayTitle,
  getPromptRatings,
  getPromptAuthor
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
    updatedAt: getUpdatedAt(promptPage),
    summary: getPromptSummary(promptPage),
    collectionDisplayTitle: getCollectionDisplayTitle(promptPage),
    ratings: getPromptRatings(promptPage),
    author: getPromptAuthor(promptPage),
    fandoms: ["To do"],
    tags: {
      warnings: [],
      characters: [],
      relationships: [],
      additional: []
    }
  }

}