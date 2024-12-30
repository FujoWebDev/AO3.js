import { TagCategory } from "types/entities";
import { TagPage } from "../page-loaders";

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
  const childTags: string[] = [];
  $tagPage(".child > div > ul > li").each((i, element) => {

    //console.log(i, $tagPage(element).children().first().text());
    let childTag = $tagPage(element).children("a").first().text();
    if (childTag != '') {
      childTags.push(childTag);
    }
  })
  return childTags;
}
