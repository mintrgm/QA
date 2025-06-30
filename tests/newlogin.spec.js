import { test, expect } from '@playwright/test';
import { LoginPage } from '../page_object/login.po';
const testData = require('../fixtures/loginFixture.json');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})

test.describe('Valid login tests', () => {
    test('Login using valid username and password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.validUser.userName, testData.validUser.password);
        await login.verifyValidLogin();
    });
})

test.describe('Invalid login tests', () => {
    test('Login using invalid username and valid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.invalidUser.userName, testData.validUser.password);
        await login.verifyInvalidLogin();
    });

    test('Login using valid username and invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.validUser.userName, testData.invalidUser.password);
        await login.verifyInvalidLogin();
    });

    test('Login using invalid username and invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testData.invalidUser.userName, testData.invalidUser.password);
        await login.verifyInvalidLogin();
    });
})

test.describe('Blank login tests', () => {
    test('Login by leaving the username blank and valid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login("","mint1234");
        await login.verifyInvalidLogin();
    });

    test('Login using valid username and blank password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login("mint@gmail.com","");
        await login.verifyInvalidLogin();
    });

    test('Login by leaving the username and password blank', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login("","");
        await login.verifyInvalidLogin();
    });
})


