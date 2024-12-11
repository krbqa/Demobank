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

    const receiver_Name = correctStandardPaymentData.receiverName;
    const account_Number = correctStandardPaymentData.accountNumber;
    const amount = correctStandardPaymentData.amount;
    const transfer_Title = correctStandardPaymentData.transferTitle;
    const calendar_Month_Id = correctStandardPaymentData.calendarMonthId;

    test.beforeEach(async ({ page }) => {
        const id = correctloginData.userId;
        const password = correctloginData.userPassword;

        await page.goto('/');
        loginPage = new LoginPage(page);
        await loginPage.loginsuccess(id, password);

        pulpitPage = new PulpitPage(page);
        await pulpitPage.clickingPaymentButton();

        paymentPage = new PaymentPage(page);
        await paymentPage.fillingInPaymentDetails(receiver_Name, account_Number, amount, transfer_Title, calendar_Month_Id);

    });

    test('successful standard payment', async ({ }) => {
        // Act
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiver_Name}`);

    });

    test('successful payment with email and adding a contact to the list', async ({ }) => {
        // Arrange
        const email = correctStandardPaymentData.email;
        const contact_Name = correctStandardPaymentData.receiverContactName;

        // Act
        await paymentPage.executePaymentWithEmailAndReceiversList(email, contact_Name);

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiver_Name}`);

    });

    test('successful express payment', async ({ }) => {
        // Arrange
        const expectedCommissionAmount = correctExpressPaymentData.commissionAmount;

        // Act
        await paymentPage.radioButton2.click();
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiver_Name}`);
        await expect(paymentPage.commissionAmount).toHaveText(expectedCommissionAmount);

    });

    test('successful standard payment with address', async ({ }) => {
        // Arrange
        const address_Details_1 = addressData.streetNrHomeNrApartmentNr;
        const address_Details_2 = addressData.postalCodeCity;

        await paymentPage.fillingInAddress(address_Details_1, address_Details_2);
        await paymentPage.fillingInPaymentDetails(receiver_Name, account_Number, amount, transfer_Title, calendar_Month_Id);
        await paymentPage.transferButton.click();
        await paymentPage.closeButton.click();

        // Assert
        await expect(paymentPage.expectedMessage).toHaveText(`Przelew wykonany! ${amount},00PLN dla ${receiver_Name}`);

    });
});