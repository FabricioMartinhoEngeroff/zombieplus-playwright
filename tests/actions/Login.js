const { expect } = require("@playwright/test");

class Login {
  constructor(page) {
    this.page = page;
  }

  async do(email, password) {
    await this.visit();
    await this.submit(email, password);
    await this.isLoggedIn();
  }

  async visit() {
    await this.page.goto("http://localhost:3000/admin/login");
    const loginForm = this.page.locator(".login-form");
    await expect(loginForm).toBeVisible();
  }

  async submitLoginForm(email, password) {
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha").fill(password);
    await this.page.getByText("Entrar").click();
  }

  async alertHaveText(target) {
    const alert = this.page.locator("span.email-alert, span.password-alert");
    await expect(alert).toHaveText(target);
  }

  async isLoggedIn() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveURL(/.*admin\/movies/);
  }
}

module.exports = { Login };
