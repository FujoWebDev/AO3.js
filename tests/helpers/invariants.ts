import { expect } from "vitest";

interface DriftingCountMatchers<R = unknown> {
  driftingCount(bounds: { atLeast: number; atMost: number }): R;
}

expect.extend({
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
  interface Assertion<T = any> extends DriftingCountMatchers<T> {}
  interface AsymmetricMatchersContaining extends DriftingCountMatchers {}
}
