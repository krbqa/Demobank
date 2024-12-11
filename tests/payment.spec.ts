import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { correctloginData } from '../test-data/login.data.ts';
import { addressData, correctExpressPaymentData, correctStandardPaymentData } from '../test-data/payment.data.ts';
import { PulpitPage } from '../pages/pulpit.page.ts';
import { PaymentPage } from '../pages/payment.page.ts';

test.describe('Payment actions', () => {

    let loginPage: LoginPage;
    let pulpitPage: PulpitPage;
    let paymentPage: PaymentPage;

    const receiverName = correctStandardPaymentData.receiverName;
    const accountNumber = correctStandardPaymentData.accountNumber;
    const amount = correctStandardPaymentData.amount;
    const transferTitle = correctStandardPaymentData.transferTitle;
    const calendarMonthId = correctStandardPaymentData.calendarMonthId;

    test.beforeEach(async ({ page }) => {
        const userId = correctloginData.userId;
        const userPassword = correctloginData.userPassword;

        await page.goto('/');
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(userId, userPassword);

        pulpitPage = new PulpitPage(page);
        await pulpitPage.clickingPaymentButton();

        paymentPage = new PaymentPage(page);
        await paymentPage.fillingInPaymentDetails(receiverName, accountNumber, amount, transferTitle, calendarMonthId);

    });

    test('successful standard payment', async ({ }) => {
        // Act
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiverName}`);

    });

    test('successful payment with email and adding a contact to the list', async ({ }) => {
        // Arrange
        const email = correctStandardPaymentData.email;
        const receiverContactName = correctStandardPaymentData.receiverContactName;

        // Act
        await paymentPage.executePaymentWithEmailAndReceiversList(email, receiverContactName);

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiverName}`);

    });

    test('successful express payment', async ({ }) => {
        // Arrange
        const expectedCommissionAmount = correctExpressPaymentData.commissionAmount;

        // Act
        await paymentPage.radioButton2.click();
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiverName}`);
        await expect(paymentPage.commissionAmount).toHaveText(expectedCommissionAmount);

    });

    test('successful standard payment with address', async ({ }) => {
        // Arrange
        const streetNrHomeNrApartmentNr = addressData.streetNrHomeNrApartmentNr;
        const postalCodeCity = addressData.postalCodeCity;

        await paymentPage.fillingInAddress(streetNrHomeNrApartmentNr, postalCodeCity);
        await paymentPage.fillingInPaymentDetails(receiverName, accountNumber, amount, transferTitle, calendarMonthId);
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiverName}`);

    });
});