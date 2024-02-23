import {
  Prompt
} from "types/entities"

import {
  getUpdatedAt
} from "./prompt-getters"

import {loadPromptPage} from "../page-loaders"

export const getPrompt = async ({
  promptId,
  collectionName,
}: {
  promptId: string;
  collectionName: string;
}): Promise<Prompt> => {
  console.log("Get Prompt!!")

  const promptPage = await loadPromptPage({id: promptId, collectionName: collectionName});//TODO

  return {
    updatedAt: getUpdatedAt(promptPage)
  }

}