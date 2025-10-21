import { defineConfig, type UserConfig } from "tsdown";
import { resolve } from "path";

export default defineConfig([
  {
    name: "AO3.js",
    entry: {
      index: resolve(import.meta.dirname, "src/index.ts"),
      urls: resolve(import.meta.dirname, "src/urls.ts"),
    },
    dts: true,
    clean: true,
    unbundle: true,
  },
]);
