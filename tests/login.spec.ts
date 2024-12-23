import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { correctloginData, incorrectloginData } from '../test-data/login.data.ts';
import { PulpitPage } from '../pages/pulpit.page.ts';

test.describe('User login to Demobank', () => {

    let loginPage: LoginPage;
    let pulpitPage: PulpitPage;

    test.beforeEach(async ({ page }) => {

        await page.goto('/');

        loginPage = new LoginPage(page);
        pulpitPage = new PulpitPage(page);

    });

    test('successful login with correct credentials', async ({ }) => {
        // Arrange
        const id = correctloginData.userId;
        const password = correctloginData.userPassword;
        const expectedUsername = 'Jan Demobankowy';

        // Act
        await loginPage.loginsuccess(id, password);

        // Assert
        await expect(pulpitPage.username).toHaveText(expectedUsername);

    });

    test('unsuccessful login with too short username', async ({ }) => {
        // Arrange
        const incorrect_id = incorrectloginData.incorrectuserId;
        const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

        // Act
        await loginPage.loginshortusername(incorrect_id);
        await loginPage.passwordInput.click();

        // Assert
        await expect(loginPage.loginErrorMessage).toHaveText(expectedErrorMessage);

    });

    test('unsuccessful login with too short password', async ({ }) => {
        // Arrange
        const incorrect_password = incorrectloginData.incorrectuserPassword;
        const expectedErrorMessage = 'hasło ma min. 8 znaków';

        // Act
        await loginPage.loginshortpassword(incorrect_password);
        await loginPage.passwordInput.blur();

        // Assert
        await expect(loginPage.passwordErrorMessage).toHaveText(expectedErrorMessage);

    });

    test('checking mandatory fields', async ({ }) => {
        // Arrange
        const expectedErrorMessage = 'pole wymagane';

        // Act
        await loginPage.loginemptyfields();

        // Assert
        await expect(loginPage.loginErrorMessage).toHaveText(expectedErrorMessage);
        await expect(loginPage.passwordErrorMessage).toHaveText(expectedErrorMessage);

    });

});