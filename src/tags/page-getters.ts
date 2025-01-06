import { TagCategory, Tag } from "types/entities";
import { TagPage } from "../page-loaders";
import { Element } from "cheerio";

export const getTagCategory = ($tagPage: TagPage): TagCategory => {
  // This will look similar to "This tag belongs to the Character Category."
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  const category = categorySentence.match(
    /This tag belongs to the (.+) Category/
  )?.[1];
  if (!category) {
    throw new Error("Category type not found for tag.");
  }
  return category.toLowerCase() as TagCategory;
};

export const hasMergers = ($tagPage: TagPage) => {
  return $tagPage(".merger").length > 0;
};

export const isCommon = ($tagPage: TagPage) => {
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  // TODO: check whether my assumption that all tags that have mergers have a parent that's
  // been marked as common.
  return (
    categorySentence.includes("It's a common tag.") || hasMergers($tagPage)
  );
};

export const isCanonical = ($tagPage: TagPage) => {
  const categorySentence = $tagPage($tagPage(".tag.profile > p")[0]).text();
  return categorySentence.includes("It's a canonical tag.");
};

export const getTagName = ($tagPage: TagPage) => {
  return $tagPage($tagPage(".tag.profile h2")[0]).text();
};

export const getCanonical = ($tagPage: TagPage) => {
  if (isCanonical($tagPage)) {
    return getTagName($tagPage);
  }
  if (!hasMergers($tagPage)) {
    return null;
  }
  return $tagPage($tagPage(".merger a.tag")).text();
};

export const getParentTags = ($tagPage: TagPage) => {
  const parentTags: string[] = [];
  $tagPage(".parent ul.tags li").each((_, element) => {
    parentTags.push($tagPage(element).text());
  });
  return parentTags;
};
export const getChildTags = ($tagPage: TagPage) => {
  return $tagPage(".child > div").map((_, divElement) => {
    const $div = $tagPage(divElement);
    const className = $div.attr("class")?.split(' ')[0] ?? "";
    const category = (className !== "freeforms" ? className : "additional tags") as TagCategory;
    return $div.find("ul > li a").map((_, aElement) => {
      const childTag = $tagPage(aElement).text();
      return childTag ? { tagName: childTag, category: category} : null;
    }).get();
  }).get();
}

export const getSubTags = ($tagPage: TagPage) => {
  return $tagPage(".sub > ul.tags > li").map((_, element) => {
    if($tagPage($tagPage(element).has("ul.tags")).length) {
      return [
        { 
          tagName: $tagPage(element).children().first().text(), 
          parentSubTag: null 
        },
        $tagPage("ul.tags", element).children("li").map((_, child) => {
          return {
            tagName: $tagPage(child).children().first().text(), 
            parentSubTag: $tagPage($tagPage(child)).parents("li").children().first().text() 
          };
        }).get()
       ].flat();
    }
    return { tagName: $tagPage(element).children().first().text(), parentSubTag: null };
  }).get();
};
