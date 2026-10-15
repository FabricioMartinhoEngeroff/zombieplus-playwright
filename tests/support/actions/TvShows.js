const { expect } = require("@playwright/test");

class TvShows {
  constructor(page) {
    this.page = page;
  }

  async goTvShows() {
    await this.page.getByRole("link", { name: "Séries de TV" }).click();
  }

  async goForm() {
    await this.page.locator("a[href$='register']").click();
  }

  async goBack() {
    await this.page.getByRole("button", { name: "Voltar" }).click();
  }

  async submitForm() {
    await this.page.getByRole("button", { name: "Cadastrar" }).click();
  }

  async create(tvshow) {
    await this.goForm();

    await this.page.getByLabel("Titulo da série").fill(tvshow.title);
    await this.page.getByLabel("Sinopse").fill(tvshow.overview);

    await this.page.locator("#select_company_id .react-select__dropdown-indicator").click();
    await this.page
      .locator(".react-select__option")
      .filter({ hasText: tvshow.company })
      .click();

    await this.page.locator("#select_year .react-select__dropdown-indicator").click();
    await this.page
      .locator(".react-select__option")
      .filter({ hasText: String(tvshow.release_year) })
      .click();

    await this.page.getByLabel("Temporadas").fill(String(tvshow.seasons));

    await this.page
      .locator("input[name=cover]")
      .setInputFiles("tests/support/fixtures" + tvshow.cover);

    if (tvshow.featured) {
      await this.page.locator(".featured .react-switch").click();
    }

    await this.submitForm();
  }

  async alertHaveText(target) {
    await expect(this.page.locator(".alert")).toHaveText(target);
  }
}

module.exports = { TvShows };