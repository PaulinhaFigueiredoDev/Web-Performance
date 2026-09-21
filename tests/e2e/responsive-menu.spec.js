import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.use({ viewport: { width: 390, height: 844 } });

test('abre e fecha o menu mobile com mouse e teclado', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await expect(homePage.mainNavigation).toBeHidden();
  await expect(homePage.mobileMenuButton).toBeVisible();
  await expect(homePage.mobileMenuButton).toHaveAttribute('aria-expanded', 'false');

  await homePage.openMobileMenu();

  await expect(homePage.mobileNavigation).toBeVisible();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');

  await expect(homePage.mobileNavigation).toBeHidden();
  await expect(homePage.mobileMenuButton).toBeFocused();
});

test('navega pelo Drawer e fecha o menu', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.openMobileMenu();

  await homePage.mobileNavigation.getByRole('link', { name: /newsletter/i }).click();

  await expect(page).toHaveURL(/#newsletter-section$/);
  await expect(homePage.mobileNavigation).toBeHidden();
  await expect(homePage.newsletterSection).toBeInViewport();
});
