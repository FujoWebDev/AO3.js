import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'
export default defineConfig({
  build: {
    lib: {
      name: 'AO3.js',
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        urls: resolve(__dirname, 'src/urls.ts')
      },
    }
  },
  plugins: [dts({ rollupTypes: true })]
})
