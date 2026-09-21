import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test('exige o preenchimento do e-mail', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.subscribeButton.click();

  const valueMissing = await homePage.emailInput.evaluate((input) => input.validity.valueMissing);
  expect(valueMissing).toBe(true);
  await expect(page).toHaveURL('http://127.0.0.1:3000/');
});

test('rejeita um endereço de e-mail inválido', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.emailInput.fill('email-invalido');
  await homePage.subscribeButton.click();

  const typeMismatch = await homePage.emailInput.evaluate((input) => input.validity.typeMismatch);
  expect(typeMismatch).toBe(true);
});

test('aceita um endereço de e-mail válido', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.subscribe('student@example.com');

  await expect(page).toHaveURL(/\?email=student%40example\.com$/);
});
