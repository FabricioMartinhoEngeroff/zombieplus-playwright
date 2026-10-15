const { expect } = require("@playwright/test");

class Popup {
  constructor(page) {
    this.page = page;
  }

  async haveText(message) {
    const popup = this.page.locator(".swal2-html-container");
    await expect(popup).toHaveText(message);
  }
}

module.exports = { Popup };
