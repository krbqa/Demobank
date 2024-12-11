import { Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) { }

    loginInput = this.page.getByTestId('login-input');
    passwordInput = this.page.getByTestId('password-input');

    loginButton = this.page.getByTestId('login-button');

    loginErrorMessage = this.page.getByTestId('error-login-id');
    passwordErrorMessage = this.page.getByTestId('error-login-password');

    async loginsuccess(userId: string, userPassword: string): Promise<void> {
        await this.loginInput.fill(userId);
        await this.passwordInput.fill(userPassword);
        await this.loginButton.click();
    }

    async loginshortusername(incorrectuserId: string): Promise<void> {
        await this.loginInput.fill(incorrectuserId);
    }

    async loginshortpassword(incorrectuserPassword: string): Promise<void> {
        await this.passwordInput.fill(incorrectuserPassword);
    }

    async loginemptyfields(): Promise<void> {
        await this.loginInput.click();
        await this.loginInput.blur();
        await this.passwordInput.click();
        await this.passwordInput.blur();
    }

}