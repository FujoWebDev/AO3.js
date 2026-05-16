import { beforeAll, beforeEach, afterEach, afterAll, expect } from "vitest";
import server from "./mocks/server";
import "./helpers/invariants";

const urlsByTest = new Map<string, string[]>();

server.events.on("request:start", ({ request }) => {
  const name = expect.getState().currentTestName;
  if (!name) return;
  const urls = urlsByTest.get(name);
  if (!urls) return;
  urls.push(`${request.method} ${request.url}`);
});

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  const name = expect.getState().currentTestName!;
  urlsByTest.set(name, []);
});

afterEach((ctx) => {
  const name = expect.getState().currentTestName!;
  const urls = urlsByTest.get(name) ?? [];
  if (urls.length > 0) {
    ctx.task.meta.requestedUrls = urls;
    const errors = ctx.task.result?.errors;
    if (ctx.task.result?.state === "fail" && errors) {
      const suffix = `\n\nURLs requested during test:\n${urls.map((url) => `  ${url}`).join("\n")}`;
      for (const error of errors) {
        error.message = `${error.message}${suffix}`;
      }
    }
  }
  urlsByTest.delete(name);
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
