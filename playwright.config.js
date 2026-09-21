import { defineConfig } from '@playwright/test';
import { webViewProfiles } from './tests/support/webview-profiles.js';

const webViewProjects = Object.entries(webViewProfiles).map(([name, profile]) => ({
  name,
  testMatch: '**/webview/**/*.spec.js',
  use: {
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    userAgent: profile.userAgent,
    isMobile: true,
    hasTouch: true,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo'
  }
}));

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,

  expect: {
    timeout: 10_000
  },

  use: {
    baseURL: 'http://127.0.0.1:3000',
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_FILE || 'reports/playwright/results.json' }]
  ],

  projects: [
    {
      name: 'desktop-chromium',
      testIgnore: '**/webview/**'
    },
    ...webViewProjects
  ],

  webServer: {
    command: 'npm run build:test && npm run start:test',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000
  }
});
