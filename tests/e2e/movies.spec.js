const { test } = require("../support");

const data = require("../support/fixtures/movies.json");
const { executeSQL } = require("../support/database");

test.beforeAll(async () => {
  await executeSQL("DELETE FROM movies;");
});

test("deve poder cadastrar um novo Filme", async ({ page }) => {
  const movie = data.create;

  await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.create(movie);
  await page.popup.haveText(
    "O título 'Resident Evil: O Hospedeiro' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.",
  );
});

test("deve poder remover um filme", async ({ page, request }) => {
  const movie = data.to_remove;
  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.remove(movie.title);
  await page.popup.haveText("Filme removido com sucesso.");
});

test("não deve cadastrar quando o titulo é duplicado", async ({ page, request }) => {
  const movie = data.duplicate;

  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.popup.haveText("Cadastro realizado com sucesso!");
});

test("não deve cadastrar quando os campos obrigatórios estiverem vazios", async ({
  page,
}) => {
  await page.login.submitLoginForm("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.goForm();
  await page.movies.submit();
  await page.movies.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
  ]);
});

test("deve realizar busca pelo termo zumbi", async ({ page, request }) => {
  const movies = data.search;

  movies.data.forEach(async (m) => {
    await request.api.postMovie(m);
  });

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.search(movies.input);
  await page.movies.tableHave(movies.outputs);
});
