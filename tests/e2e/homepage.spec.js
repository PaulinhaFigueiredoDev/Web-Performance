import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test('carrega a homepage e apresenta os produtos esperados', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  await expect(homePage.mainHeading).toBeVisible();
  await expect(homePage.bestSellerCards).toHaveCount(3);
  await expect(homePage.allProductCards).toHaveCount(3);
  await expect(homePage.bestSellerCards.first()).toContainText('Apple Headset');
  await expect(homePage.allProductCards.first()).toContainText('Essential VR Headset');
  await expect(homePage.page.getByText(/we could not load the shop/i)).toHaveCount(0);
});

test('exibe informações completas nos cards de produto', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  const firstProduct = homePage.bestSellerCards.first();
  await expect(firstProduct.getByRole('img')).toHaveAttribute('alt', /apple virtual reality headset/i);
  await expect(firstProduct.getByRole('heading', { level: 3 })).toHaveText('Apple Headset');
  await expect(firstProduct).toContainText('US$ 450.00');
  await expect(firstProduct.getByRole('button', { name: /add to bag: apple headset/i })).toBeVisible();
});

test('apresenta a informação de imposto depois do carregamento', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  await expect(homePage.countryBar).toBeVisible();
  await expect(homePage.countryBar).toContainText('France');
  await expect(homePage.countryBar).toContainText('20%');
});
