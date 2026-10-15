const { expect } = require("@playwright/test");

class Login {
  constructor(page) {
    this.page = page;
  }

  async do(email, password, username) {
    await this.visit();
    await this.submitLoginForm(email, password);
    await this.isLoggedIn(username);
  }

  async visit() {
    await this.page.goto("/admin/login");
    const loginForm = this.page.locator(".login-form");
    await expect(loginForm).toBeVisible();
  }

  async submitLoginForm(email, password) {
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha").fill(password);
    await this.page.getByText("Entrar").click();
  }

  async alertHaveText(target) {
    const alert = this.page.locator("span.alert");
    await expect(alert).toHaveText(target);
  }

  async isLoggedIn(username) {
    const loggedUser = this.page.locator(".logged-user");
    await expect(loggedUser).toHaveText(`Olá, ${username}`);
  }
}

module.exports = { Login };
