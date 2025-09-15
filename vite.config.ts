import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      name: "AO3.js",
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        urls: resolve(__dirname, "src/urls.ts"),
      },
      formats: ["es"],
    },
  },
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
});
