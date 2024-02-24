import {
  Prompt
} from "types/entities"

import {
  getUpdatedAt,
  getPromptSummary,
  getCollectionDisplayTitle
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
    collectionDisplayTitle: getCollectionDisplayTitle(promptPage)
  }

}