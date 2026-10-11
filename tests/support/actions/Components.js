const { expect } = require("@playwright/test");

class Popup {
  constructor(page) {
    this.page = page;
  }

  async haveText(message) {
    const popup = this.page.locator(".toast");
    await expect(popup).toContainText(message);
    await expect(popup).not.toBeVisible({ timeout: 10000 });
  }
}

module.exports = { Popup};
