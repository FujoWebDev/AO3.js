import type { UserWorksPage } from "src/page-loaders";

export const getUserWorksBlurbs = ($worksPage: UserWorksPage) => {
  if ($worksPage("#main.works-index").length === 0) {
    throw new Error("Works page is missing the expected public index");
  }

  return $worksPage("ol.work.index > li.work.blurb")
    .map((_index, element) => $worksPage(element).html() ?? "")
    .get();
};

export const getUserWorksTotalResults = ($worksPage: UserWorksPage) => {
  const heading = $worksPage("#main.works-index h2.heading").first().text();
  const totalMatch = heading.match(/([\d,]+)\s+Works?\b/i);
  return totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0;
};
