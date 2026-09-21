import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage.js';

test('apresenta as dimensões da saúde da aplicação', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();

  await expect(dashboard.healthHeading).toBeVisible();
  await expect(dashboard.e2eHeading).toBeVisible();
  await expect(dashboard.webViewHeading).toBeVisible();
  await expect(dashboard.performanceHeading).toBeVisible();
  await expect(dashboard.accessibilityHeading).toBeVisible();
  await expect(dashboard.lighthouseAccessibilityHeading).toBeVisible();
  await expect(dashboard.axeAccessibilityHeading).toBeVisible();
  await expect(dashboard.webViewProfiles.low).toBeVisible();
  await expect(dashboard.webViewProfiles.mid).toBeVisible();
  await expect(dashboard.webViewProfiles.high).toBeVisible();
  await dashboard.webViewValidationDetails.first().click();
  await expect(dashboard.webViewBridgeCheck).toBeVisible();
  await expect(dashboard.refreshButton).toBeEnabled();
});

test('atualiza os dados pela API de qualidade', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();

  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/quality'));
  await dashboard.refreshButton.click();
  const response = await responsePromise;

  expect(response.ok()).toBe(true);
  await expect(dashboard.refreshButton).toBeEnabled();
});
