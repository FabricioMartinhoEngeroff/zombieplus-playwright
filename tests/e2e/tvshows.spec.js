const { test } = require("../support");
const data = require("../support/fixtures/tvshows.json");
const { executeSQL } = require("../support/database");

test.beforeAll(async () => {
  await executeSQL("DELETE FROM tvshows;"); 
});

test("deve poder cadastrar uma nova série", async ({ page }) => {
  const tvshow = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.goTvShows();
  await page.tvshows.create(tvshow);

  await page.popup.haveText(
    `A série '${tvshow.title}' foi adicionada ao catálogo.`
  );
});

test("não deve cadastrar quando os campos obrigatórios não são preenchidos", async ({ page }) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.goTvShows();
  await page.tvshows.goForm();
  await page.tvshows.submitForm();

  await page.tvshows.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório (apenas números)",
  ]);
});