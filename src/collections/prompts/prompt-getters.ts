import {
  Author,
  WorkRatings
} from "types/entities"
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

export const getCollectionDisplayTitle = ($promptPage : PromptPage): string => {
  const titleElement = $promptPage("h2.collections");
  const title = titleElement.text().trim();
  return title;
}

export const getPromptRatings = ($promptPage: PromptPage): WorkRatings[] => {
  const ratingsString = $promptPage("ul.required-tags span.rating").text().trim();
  //if the work has no rating, the string gathered from the page will be "No rating"
  const hasRatings = !(ratingsString === "No rating");
  const ratingsArray = ratingsString.split(', ');
  
  if (hasRatings){
    ratingsArray.forEach(rating => {
      if (!Object.values(WorkRatings).includes(rating as WorkRatings)) {
        throw new Error("An unknown rating was found on the page: \""+ rating+"\"");
      }
    })
  }

  if (hasRatings) return ratingsArray as WorkRatings[]
  else return ["Not Rated"] as WorkRatings[]

};

export const getPromptAuthor = ($promptPage: PromptPage): Author | "Anonymous"=> {

  const requestHeading = $promptPage("#main.prompts-show.dashboard.region > h2").text().trim();

  if(requestHeading === "Request by Anonymous") return "Anonymous"

  const pseudAndUser = /Request by ([^\(]*)?\(?([^\)]*)/g
  
  const captures = pseudAndUser.exec(requestHeading);

  if (!captures) throw new Error("Could not evalueate Prompt Author String");

  const pseud = captures[1].trim();  
  const user = captures[2] ? captures[2] : pseud;

  return {
    username: user,
    pseud: pseud
  } as Author

}