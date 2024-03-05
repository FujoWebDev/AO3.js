import {
  Author,
  WorkRatings,
  WorkWarnings,
  Prompt
} from "types/entities"
import { PromptPage } from "../../page-loaders";

export const getPostedAt = ($promptPage : PromptPage): string => {
  const dateElement = $promptPage("p.datetime:first");
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

  const ratingsString = $promptPage("ul.required-tags:first span.rating").text().trim();
  //if the work has no rating, the string gathered from the page will be "No rating"
  const hasRatings = !(ratingsString === "No rating");
  const ratingsArray = ratingsString.split(', ');
  
  if (hasRatings){
    ratingsArray.forEach(rating => {
      if (!Object.values(WorkRatings).includes(rating as WorkRatings)) {
        // console.log("working with cheerio")
        // console.log($promptPage("ul.required-tags:first span.rating").text());
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

export const getPromptFandoms = ($promptPage: PromptPage): string[] => {
  const fandoms: string[] = [];

  $promptPage("h5.fandoms.heading:first a.tag").each(function (i, element) {
    fandoms[i] = $promptPage(element).text().trim();
  });
  return fandoms;
};

export const getPromptAdditionalTags = ($promptPage: PromptPage): string[] => {
  const freeform: string[] = [];
  $promptPage("li.freeforms a.tag").each(function (i) {
    freeform[i] = $promptPage(this).text().trim();
  });
  return freeform;
};

export const getPromptWarnings = ($promptPage: PromptPage): WorkWarnings[] => {
  const warnings: WorkWarnings[] = [];

  $promptPage("li.warnings a.tag").each(function (i, element) {
    const warning = $promptPage(element).text().trim();
    if (!Object.values(WorkWarnings).includes(warning as WorkWarnings)) {
      throw new Error("An unknown warning was found on the page");
    }

    warnings[i] = warning as WorkWarnings;
  });
  return warnings;
};

export const getPromptCharacters = ($promptPage: PromptPage): string[] => {
  const characters: string[] = [];

  $promptPage("li.characters a.tag").each(function (i, character) {
    characters[i] = $promptPage(character).text().trim();
  });
  return characters;
};

export const getPromptRelationships = ($promptPage: PromptPage): string[] => {
  const ships: string[] = [];

  $promptPage("li.relationships a.tag").each(function (i, ship) {
    ships[i] = $promptPage(ship).text().trim();
  });
  return ships;
};

export const getPromptClaims = ($promptPage: PromptPage): Prompt["claims"] => {
  const claimNodesText = $promptPage(".commas.index.group").text().trim();

  //There are no claims
  if(claimNodesText === "") return {count: 0} as Prompt["claims"];

  const regexAnonCount = /([^ ]*) anonymous/g
  const captures = regexAnonCount.exec(claimNodesText);

   if (!captures) {
    //No anon claims. Get known claims:
      const claimants:string[] = [];

      const lis = $promptPage("div.claims li").each(function (i, element) {
        claimants[i] = $promptPage(element).text().trim();
      });

      if(lis.length === 0) throw new Error("Could not process Claimants");
      return {count: lis.length, isAnonCollection: false, claimantUsernames: claimants} as Prompt["claims"];
   };

  //There are anonymous claimes
  const anonCount = Number(captures[1].replace(/,/g, ""));
  if (Number.isNaN(anonCount)) throw new Error("Error processing prompt anonymous claim count: NaN");

  return {count: anonCount, isAnonCollection: true} as Prompt["claims"];
}

export const getPromptCategories = ($promptPage: PromptPage): Prompt["categories"] => {
  



  return []
}