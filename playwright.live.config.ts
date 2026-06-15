import { defineConfig, devices } from '@playwright/test';

const liveBaseUrl = process.env.LIVE_BASE_URL || 'https://veerababu-sutapalli.vercel.app';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/live-production.spec.ts', '**/three-d-lab.live.spec.ts'],
  fullyParallel: false,
  forbidOnly: false,
  retries: 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: liveBaseUrl,
    trace: 'on-first-retry',
    // Give live site extra time for cold starts
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No webServer — tests run against the real deployed site
});
