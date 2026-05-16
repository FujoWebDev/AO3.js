import type { Reporter, TestModule } from "vitest/node";

declare module "vitest" {
  interface TaskMeta {
    requestedUrls?: string[];
  }
}

export default class FailedUrlsReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>) {
    const failed: { name: string; urls: string[] }[] = [];
    for (const module of testModules) {
      for (const test of module.children.allTests("failed")) {
        const urls = test.meta().requestedUrls;
        if (!urls || urls.length === 0) continue;
        failed.push({ name: test.fullName, urls });
      }
    }

    if (failed.length === 0) return;

    console.log("\nURLs requested during failed tests:");
    for (const { name, urls } of failed) {
      console.log(`  ${name}`);
      for (const url of urls) {
        console.log(`    ${url}`);
      }
    }
  }
}
