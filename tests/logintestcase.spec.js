// @ts-check
import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Login Tests', () => {

  const loginURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  const validUsername = 'Admin';
  const validPassword = 'admin123';
  const invalidUsername = 'WrongAdmin';
  const invalidPassword = 'wrongpass';
  const specialCharUsername = 'admin!@#$';
  const sqlInjection = "' OR 1=1 --";

  // Helper: Go to login and wait for inputs
  async function gotoLoginPage(page) {
    await page.goto(loginURL);
    await page.locator('input[name="username"]').waitFor({ state: 'visible' });
  }

  // Valid Login
  test('Valid Login', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', validUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  // Invalid Username
  test('Invalid Username', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', invalidUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(loginURL);
  });

  // Invalid Password
  test('Invalid Password', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', validUsername);
    await page.fill('input[name="password"]', invalidPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(loginURL);
  });

  // Blank Username
  test('Blank Username', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Required')).toBeVisible();
  });

  // Blank Password
  test('Blank Password', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', validUsername);
    await page.fill('input[name="password"]', '');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Required')).toBeVisible();
  });

  // Blank Username and Password
  test('Blank Username and Password', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');
    await page.getByRole('button', { name: 'Login' }).click();

    const requiredFields = await page.locator('span:has-text("Required")').count();
    expect(requiredFields).toBeGreaterThanOrEqual(2);
  });

  // SQL Injection Attempt
  test('SQL Injection Attempt', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', sqlInjection);
    await page.fill('input[name="password"]', sqlInjection);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(loginURL);
  });

  // Case Sensitivity in Username
  test('Case Sensitivity in Username', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', 'ADMIN'); // uppercase
    await page.fill('input[name="password"]', validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // Special Characters in Username
  test('Special Characters in Username', async ({ page }) => {
    await gotoLoginPage(page);
    await page.fill('input[name="username"]', specialCharUsername);
    await page.fill('input[name="password"]', validPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

});
