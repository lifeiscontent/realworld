import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { reactRouter } from '@react-router/dev/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import codegen from 'vite-plugin-graphql-codegen';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    // The React Router plugin builds the app. Vitest and Storybook render
    // the route modules in a test router, so they use the React plugin (see
    // .storybook/main.ts).
    process.env.VITEST ? react() : reactRouter(),
    // Makes the operation types from codegen.ts when Vite starts. In dev, it
    // makes them again when a document or the API schema changes. Vitest
    // runs once, so it needs no watcher.
    codegen({
      throwOnStart: true,
      matchOnSchemas: true,
      enableWatcher: !process.env.VITEST,
    }),
  ],
  // Route modules load lazily, so Vite finds some dependencies only after the
  // first page loads, and then reloads the page. Listing them avoids that
  // reload, which can break a test run on a new dev server.
  optimizeDeps: {
    include: [
      '@apollo/client',
      '@apollo/client/link/context',
      '@apollo/client/react',
      'clsx',
      'react-markdown',
      'zod',
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
