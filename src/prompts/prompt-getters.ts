import { PromptPage } from "../page-loaders";

export const getUpdatedAt = ($promptPage : PromptPage): string => {
  const dateElement = $promptPage("p.datetime");
  const date = dateElement.text();

  return date;
}