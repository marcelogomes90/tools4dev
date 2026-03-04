import { defineConfig, devices } from '@playwright/test';

const e2eHost = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const e2ePort = process.env.PLAYWRIGHT_PORT ?? '3100';
const e2eBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://${e2eHost}:${e2ePort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: e2eBaseUrl,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `yarn dev --hostname ${e2eHost} --port ${e2ePort}`,
    url: e2eBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
