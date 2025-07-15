import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'AO3.js',
      entry: './src/index.ts',
      fileName: 'ao3',
    }
  }
})
