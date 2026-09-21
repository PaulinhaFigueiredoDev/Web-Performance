import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test('navega para a seção Best Sellers', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.goToBestSellers();

  await expect(page).toHaveURL(/#best-sellers-section$/);
  await expect(homePage.bestSellersSection).toBeInViewport();
});

test('navega para a seção de newsletter', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.goToNewsletter();

  await expect(page).toHaveURL(/#newsletter-section$/);
  await expect(homePage.newsletterSection).toBeInViewport();
});

test('o link About us aponta para conteúdo existente', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.aboutLink.click();

  await expect(page).toHaveURL(/#about-us$/);
  await expect(page.locator('#about-us')).toBeInViewport();
});
