import { PromptPage } from "../../page-loaders";

export const getUpdatedAt = ($promptPage : PromptPage): string => {
  const dateElement = $promptPage("p.datetime");
  const date = dateElement.text();

  return date;
}

export const getPromptSummary = ($promptPage : PromptPage): string | null => {
  const summary = $promptPage("blockquote.userstuff.summary").html();
  // trim returns a new string, removes any whitespace at the start and end
  // usually a new line '\n is returned at the beginning and end of the summary.
  return summary ? summary.trim() : null;
};