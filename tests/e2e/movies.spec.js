const { test } = require("../support");

const data = require("../support/fixtures/movies.json");

const {execute} = require("../support/database");

test("deve poder cadastrar um novo Filme", async (page) => {

  const movie = data.create;

  await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`);

  await page.landing.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "pwd123");
  await page.movies.isLoggedIn();
  await page.movies.create("Nome do filme", "Sinopse do filme", "Netflix", "2023");
  await page.toast.containText('Cadastro realizado com sucesso!');
});