import { defineConfig } from '@playwright/test';
import { baseConfig } from './e2e/playwright.base';

// The shared RealWorld e2e suite. This app has its own GraphQL API, so the
// suite runs in fullstack mode (TEST_MODE=fullstack): it drives everything
// through the UI.
export default defineConfig({
  ...baseConfig,
  testDir: './e2e',
  use: { ...baseConfig.use, baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'pnpm dev --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
