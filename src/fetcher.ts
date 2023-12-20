let fetcher: typeof globalThis.fetch | null = null;

export const getFetcher = () => {
  return fetcher ?? globalThis.fetch;
};

export const setFetcher = (newFetcher: typeof globalThis.fetch) => {
  fetcher = newFetcher;
};
