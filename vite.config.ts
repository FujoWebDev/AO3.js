import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'
export default defineConfig({
  build: {
    lib: {
      name: 'AO3.js',
      entry: './src/index.ts',
      fileName: 'ao3',
    }
  },
  plugins: [dts()]
})
