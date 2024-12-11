import { Page } from "@playwright/test";

export class PaymentPage {
    constructor(private page: Page) { }

    receiverName = this.page.getByTestId('transfer_receiver');
    accountNumber = this.page.getByTestId('form_account_to');
    amount = this.page.locator('#widget_1_topup_amount');
    transferTitle = this.page.getByTestId('form_title');
    date = this.page.locator('#form_date');

    radioButton1 = this.page.locator('#form_type1');
    radioButton2 = this.page.locator('#form_type2');

    emailConfirmationCheckbox = this.page.locator('#form_is_email');
    addToContactsCheckbox = this.page.locator('#form_add_receiver');
    trustedCheckbox = this.page.locator('#form_trusted');

    emailField = this.page.locator('#form_email');
    receiverContactName = this.page.locator('#form_receiver_name');

    transferButton = this.page.locator('#execute_btn');

    calendarNextButton = this.page.locator('span.ui-icon.ui-icon-circle-triangle-e');
    calendarPreviousButton = this.page.locator('span.ui-icon ui-icon-circle-triangle-w"');
    calendarMonthButton = this.page.locator('select.ui-datepicker-month');
    calendarYearButton = this.page.locator('select.ui-datepicker-year');
    calendarDayOption = this.page.locator('a.ui-state-default:has-text("16")');

    closeButton = this.page.getByTestId('close-button');

    expectedMessage = this.page.getByTestId('message-text');

    commissionAmount = this.page.locator('#form_fee');

    showAddressButton = this.page.locator('.i-show.showhide[data-target="form_address"]').first();

    streetNrHomeNrApartmentNr = this.page.locator('#form_receiver_address1');
    postalCodeCity = this.page.locator('#form_receiver_address2');

    async fillingInPaymentDetails(receiverName: string, accountNumber: string, amount: string, transferTitle: string, calendarMonthId: string): Promise<void> {
        await this.receiverName.fill(receiverName);
        await this.accountNumber.fill(accountNumber);
        await this.amount.fill(amount);
        await this.transferTitle.fill(transferTitle);
        await this.date.click();
        await this.calendarNextButton.click();
        await this.calendarMonthButton.selectOption(calendarMonthId);
        await this.calendarDayOption.click();
    }

    async executePaymentWithEmailAndReceiversList(email: string, receiverContactName: string): Promise<void> {
        await this.emailConfirmationCheckbox.click();
        await this.emailField.fill(email);
        await this.addToContactsCheckbox.click();
        await this.receiverContactName.fill(receiverContactName);
        await this.trustedCheckbox.click();
        await this.transferButton.click();
        await this.closeButton.click();
    }

    async fillingInAddress(streetNrHomeNrApartmentNr: string, postalCodeCity: string): Promise<void> {
        await this.showAddressButton.click();
        await this.streetNrHomeNrApartmentNr.fill(streetNrHomeNrApartmentNr);
        await this.postalCodeCity.fill(postalCodeCity);
    }
}

