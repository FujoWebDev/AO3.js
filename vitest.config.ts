import { defineConfig } from 'vitest/config';
import FailedUrlsReporter from './tests/failed-urls-reporter';

export default defineConfig({
  test: {
    setupFiles: './tests/setup.ts',
    reporters: ['default', new FailedUrlsReporter()]
  }
})
