import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import FailedUrlsReporter from './tests/failed-urls-reporter';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: './tests/setup.ts',
    reporters: ['default', new FailedUrlsReporter()]
  }
})
