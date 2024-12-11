import { Page } from "@playwright/test";

export class PulpitPage {
    constructor(private page: Page) { }

    username = this.page.getByTestId('user-name');

    transferReceiver = this.page.locator('#widget_1_transfer_receiver');
    transferAmount = this.page.locator('#widget_1_transfer_amount');
    transferTitle = this.page.locator('#widget_1_transfer_title');

    transferButton = this.page.locator('#execute_btn');
    closeButton = this.page.getByTestId('close-button');

    expectedPaymentMessage = this.page.getByTestId('message-text');

    moneyValue = this.page.locator('#money_value');

    quickPaymentErrorMessage = this.page.getByTestId('error-widget-1-transfer-receiver');

    topUpPhoneNumber = this.page.locator('#widget_1_topup_receiver');
    topUpAmount = this.page.locator('#widget_1_topup_amount');
    topUpCheckboxAgreement = this.page.locator('#widget_1_topup_agreement');

    topUpButton = this.page.locator('#execute_phone_btn');
    topUpCloseButton = this.page.getByTestId('close-button');

    topUpPhoneNumberErrorMessage = this.page.locator('#error_widget_1_topup_receiver');
    topUpAmountErrorMessage = this.page.locator('#error_widget_1_topup_amount');
    topUpCheckboxAgreementErrorMessage = this.page.locator('#error_widget_1_topup_agreement');

    paymentButton = this.page.locator('#payments_btn');


    async executeQuickPayment(receiverId: string, transferAmount: string, transferTitle: string): Promise<void> {
        await this.transferReceiver.selectOption(receiverId);
        await this.transferAmount.fill(transferAmount);
        await this.transferTitle.fill(transferTitle);
        await this.transferButton.click();
        await this.closeButton.click();
    }

    async unsuccessfulQuickPayment(): Promise<void> {
        await this.transferButton.click();
    }

    async successfulMobileTopUp(topUpPhoneNumber: string, topUpAmount: string): Promise<void> {
        await this.topUpPhoneNumber.selectOption(topUpPhoneNumber);
        await this.topUpAmount.fill(topUpAmount);
        await this.topUpCheckboxAgreement.click();
        await this.topUpButton.click();
        await this.topUpCloseButton.click();
    }

    async checkingMandatoryFieldsTopUp(): Promise<void> {
        await this.topUpButton.click();
    }

    async clickingPaymentButton(): Promise<void> {
        await this.paymentButton.click();
    }

    async checkingMinimumLimit(topUpPhoneNumber: string, topUpAmountMin: string): Promise<void> {
        await this.topUpPhoneNumber.click();
        await this.page.waitForSelector('#widget_1_topup_receiver');
        await this.topUpPhoneNumber.selectOption(topUpPhoneNumber);
        await this.page.waitForTimeout(5000);
        await this.topUpAmount.fill(topUpAmountMin);
        await this.topUpAmount.blur();
        await this.page.waitForTimeout(3000);
    }

    async checkingMaximumLimit(topUpPhoneNumber: string, topUpAmountMax: string): Promise<void> {
        await this.topUpPhoneNumber.click();
        await this.page.waitForSelector('#widget_1_topup_receiver');
        await this.topUpPhoneNumber.selectOption(topUpPhoneNumber);
        await this.page.waitForTimeout(5000);
        await this.topUpAmount.fill(topUpAmountMax);
        await this.topUpAmount.blur();
        await this.page.waitForTimeout(3000);
    }

}