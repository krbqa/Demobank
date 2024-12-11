import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { correctloginData } from '../test-data/login.data.ts';
import { PulpitPage } from '../pages/pulpit.page.ts';
import { correctPhoneTopUpData, correctQuickPaymentData, moneyLimits } from '../test-data/pulpit.data.ts';

test.describe('Standard payment', () => {

    let loginPage: LoginPage;
    let pulpitPage: PulpitPage;

    test.beforeEach(async ({ page }) => {
        const userId = correctloginData.userId;
        const userPassword = correctloginData.userPassword;

        await page.goto('/');
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(userId, userPassword);

        pulpitPage = new PulpitPage(page);

    });

    test('successful quick payment', async ({ page }) => {
        // Arrange
        const receiverId = correctQuickPaymentData.receiverId;
        const transferAmount = correctQuickPaymentData.transferAmount;
        const transferTitle = correctQuickPaymentData.transferTitle;

        const expectedTransferReceiver = 'Michael Scott';

        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(transferAmount);

        // Act
        await pulpitPage.executeQuickPayment(receiverId, transferAmount, transferTitle);

        // Assert
        await expect(pulpitPage.expectedPaymentMessage).toHaveText(`Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`);
        await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);

    });

    test('unsuccessful quick payment', async ({ }) => {
        // Arrange
        const errorMessage = 'pole wymagane';

        // Act
        await pulpitPage.unsuccessfulQuickPayment();

        // Assert
        await expect(pulpitPage.quickPaymentErrorMessage).toHaveText(errorMessage);

    });

});

test.describe('Mobile TopUp payments', () => {

    let loginPage: LoginPage;
    let pulpitPage: PulpitPage;

    const topUpPhoneNumber = correctPhoneTopUpData.topUpPhoneNumber;

    test.beforeEach(async ({ page }) => {
        const userId = correctloginData.userId;
        const userPassword = correctloginData.userPassword;

        await page.goto('/')
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(userId, userPassword);

        pulpitPage = new PulpitPage(page);

    });

    test('successful mobile topup', async ({ page }) => {
        // Arrange
        const topUpAmount = correctPhoneTopUpData.topUpAmount;

        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(topUpAmount);

        // Act
        await pulpitPage.successfulMobileTopUp(topUpPhoneNumber, topUpAmount);

        // Assert
        await expect(pulpitPage.expectedPaymentMessage).toHaveText(`Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpPhoneNumber}`);
        await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);

    });

    test('checking mandatory fields mobile topup', async ({ }) => {
        // Arrange
        const expectedErrorMessage = 'pole wymagane';

        // Act
        await pulpitPage.checkingMandatoryFieldsTopUp();

        // Assert
        await expect(pulpitPage.topUpPhoneNumberErrorMessage).toHaveText(expectedErrorMessage);
        await expect(pulpitPage.topUpAmountErrorMessage).toHaveText(expectedErrorMessage);
        await expect(pulpitPage.topUpCheckboxAgreementErrorMessage).toHaveText(expectedErrorMessage);

    });

    test('checking minimum limit mobile topup', async ({ }) => {
        // Arrange
        const topUpAmount = moneyLimits.topUpAmountMin;

        const expectedErrorMessage = 'kwota musi być większa lub równa 5';

        // Act
        await pulpitPage.checkingMinimumLimit(topUpPhoneNumber, topUpAmount);

        // Assert
        await expect(pulpitPage.topUpAmountErrorMessage).toHaveText(expectedErrorMessage);

    });

    test('checking maximum limit mobile topup', async ({ }) => {
        // Arrange
        const topUpAmount = moneyLimits.topUpAmountMax;

        const expectedErrorMessage = 'kwota musi być mniejsza lub równa 150';

        // Act
        await pulpitPage.checkingMaximumLimit(topUpPhoneNumber, topUpAmount);

        // Assert
        await expect(pulpitPage.topUpAmountErrorMessage).toHaveText(expectedErrorMessage);

    });

});