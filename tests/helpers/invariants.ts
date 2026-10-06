import { expect } from "vitest";
import { prettify } from "htmlfy";

export function expectHtml(html: string | null) {
  return expect(html === null ? null : prettify(html));
}

interface DriftingCountMatchers<R = unknown> {
  driftingCount(bounds: { atLeast: number; atMost: number }): R;
}

interface HtmlMatchers<R = unknown> {
  toEqualHtml(expected: string | null): R;
}

expect.extend({
  toEqualHtml(received: unknown, expected: string | null) {
    if (
      (received !== null && typeof received !== "string") ||
      (expected !== null && typeof expected !== "string")
    ) {
      throw new TypeError("toEqualHtml requires HTML strings or null");
    }

    const actualHtml = received === null ? null : prettify(received);
    const expectedHtml = expected === null ? null : prettify(expected);

    return {
      pass: actualHtml === expectedHtml,
      message: () =>
        `expected HTML ${this.isNot ? "not " : ""}to match after formatting`,
      actual: actualHtml,
      expected: expectedHtml,
    };
  },
  driftingCount(
    received: unknown,
    bounds: Parameters<DriftingCountMatchers["driftingCount"]>[0],
  ) {
    const { atLeast, atMost } = bounds;
    const pass =
      typeof received === "number" &&
      Number.isFinite(received) &&
      received >= atLeast &&
      received <= atMost;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within [${atLeast}, ${atMost}]`
          : `expected ${received} to be a number within [${atLeast}, ${atMost}]`,
      actual: received,
      expected: `number in [${atLeast}, ${atMost}]`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any>
    extends DriftingCountMatchers<T>, HtmlMatchers<T> {}
  interface AsymmetricMatchersContaining
    extends DriftingCountMatchers, HtmlMatchers {}
}
