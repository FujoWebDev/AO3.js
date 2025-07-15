import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'ao3.js',
      entry: './src/index.ts'
    }
  }
})
