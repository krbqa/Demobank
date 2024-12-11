import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { correctloginData } from '../test-data/login.data.ts';
import { PulpitPage } from '../pages/pulpit.page.ts';
import { correctPhoneTopUpData, correctQuickPaymentData, moneyLimits } from '../test-data/pulpit.data.ts';

test.describe('Standard payment', () => {

    let loginPage: LoginPage;
    let pulpitPage: PulpitPage;

    test.beforeEach(async ({ page }) => {
        const id = correctloginData.userId;
        const password = correctloginData.userPassword;

        await page.goto('/');
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(id, password);

        pulpitPage = new PulpitPage(page);

    });

    test('successful quick payment', async ({ page }) => {
        // Arrange
        const receiver_Id = correctQuickPaymentData.receiverId;
        const transfer_Amount = correctQuickPaymentData.transferAmount;
        const transfer_Title = correctQuickPaymentData.transferTitle;

        const expectedTransferReceiver = 'Michael Scott';

        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(transfer_Amount);

        // Act
        await pulpitPage.executeQuickPayment(receiver_Id, transfer_Amount, transfer_Title);

        // Assert
        await expect(pulpitPage.expectedPaymentMessage).toHaveText(`Przelew wykonany! ${expectedTransferReceiver} - ${transfer_Amount},00PLN - ${transfer_Title}`);
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
        const id = correctloginData.userId;
        const password = correctloginData.userPassword;

        await page.goto('/')
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(id, password);

        pulpitPage = new PulpitPage(page);

    });

    test('successful mobile topup', async ({ page }) => {
        // Arrange
        const top_Up_Amount = correctPhoneTopUpData.topUpAmount;

        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(top_Up_Amount);

        // Act
        await pulpitPage.successfulMobileTopUp(topUpPhoneNumber, top_Up_Amount);

        // Assert
        await expect(pulpitPage.expectedPaymentMessage).toHaveText(`Doładowanie wykonane! ${top_Up_Amount},00PLN na numer ${topUpPhoneNumber}`);
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
        const top_Up_Amount = moneyLimits.topUpAmountMin;

        const expectedErrorMessage = 'kwota musi być większa lub równa 5';

        // Act
        await pulpitPage.checkingMinimumLimit(topUpPhoneNumber, top_Up_Amount);

        // Assert
        await expect(pulpitPage.topUpAmountErrorMessage).toHaveText(expectedErrorMessage);

    });

    test('checking maximum limit mobile topup', async ({ }) => {
        // Arrange
        const top_Up_Amount = moneyLimits.topUpAmountMax;

        const expectedErrorMessage = 'kwota musi być mniejsza lub równa 150';

        // Act
        await pulpitPage.checkingMaximumLimit(topUpPhoneNumber, top_Up_Amount);

        // Assert
        await expect(pulpitPage.topUpAmountErrorMessage).toHaveText(expectedErrorMessage);

    });

});