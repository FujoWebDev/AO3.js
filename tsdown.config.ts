import { defineConfig } from "tsdown";
import { resolve } from "path";

export default defineConfig([
  {
    name: "AO3.js",
    entry: {
      index: resolve(import.meta.dirname, "src/index.ts"),
      urls: resolve(import.meta.dirname, "src/urls.ts"),
      "zod-schemas": resolve(import.meta.dirname, "types/zod/generated/schemas.ts"),
      "zod-schemas-v4": resolve(import.meta.dirname, "types/zod/generated/schemas-v4.ts"),
    },
    dts: true,
    clean: true,
    unbundle: true,
    external: ["zod", "zod/v3"],
  },
]);
