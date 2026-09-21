import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test('oferece skip link e ordem inicial de foco coerente', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await page.keyboard.press('Tab');
  await expect(homePage.skipLink).toBeFocused();
  await expect(homePage.skipLink).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(homePage.homeLink).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(homePage.aboutLink).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(homePage.bestSellersLink).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/#best-sellers-section$/);
});
