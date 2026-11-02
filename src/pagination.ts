interface PagedResult {
  pages: { total: number; current: number };
}

/**
 * Goes through every page of a paginated getter (like `getSeries`,
 * `getUserWorks`, or `searchTags`), one page at a time. Pass the getter and
 * its options without `page`, since `getAllPages` sets it.
 *
 * Pages are only fetched as you loop, so `break` stops any further requests.
 *
 * Results can shift while you go through them: if a work is updated as this 
 * run, it may show up twice or get skipped.
 *
 * @example
 * for await (const result of getAllPages(getSeries, { seriesId: 12345 })) {
 *   console.log(result.works);
 * }
 */
export async function* getAllPages<Args, Result extends PagedResult>(
  getter: (args: Args & { page: number }) => Promise<Result>,
  // NoInfer: take the option types from the getter, so a literal like
  // sortColumn: "kudos_count" isn't widened to string
  args: NoInfer<Args>
): AsyncGenerator<Result, void, undefined> {
  let page = 1;
  let total = 1;
  while (page <= total) {
    const result = await getter({ ...args, page });
    total = result.pages.total;
    yield result;
    page++;
  }
}

/**
 * Like `getAllPages`, but fetches every page up front and returns them all
 * as an array. Prefer `getAllPages` when you might not need every page,
 * since each page is a separate request.
 *
 * @example
 * const pages = await collectAllPages(getSeries, { seriesId: 12345 });
 * const works = pages.flatMap((page) => page.works);
 */
export const collectAllPages = async <Args, Result extends PagedResult>(
  getter: (args: Args & { page: number }) => Promise<Result>,
  // NoInfer: take the option types from the getter, so a literal like
  // sortColumn: "kudos_count" isn't widened to string
  args: NoInfer<Args>
): Promise<Result[]> => {
  const results: Result[] = [];
  for await (const result of getAllPages(getter, args)) {
    results.push(result);
  }
  return results;
};
