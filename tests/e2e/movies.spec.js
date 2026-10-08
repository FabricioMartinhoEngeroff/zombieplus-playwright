const { test } = require("../support");

const data = require("../support/fixtures/movies.json");

const { executeSQL } = require("../support/database");

test("deve poder cadastrar um novo Filme", async (page) => {
  const movie = data.create;

  await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.create(movie);
  await page.toast.containText("Cadastro realizado com sucesso!");
});

test("não deve cadastrar quando o titulo é duplicado", async (page, request) => {
  const movie = data.duplicate;

  await request.api.postMovie(movie);
  

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.toast.containText("Cadastro realizado com sucesso!");
});

test("não deve cadastrar quando os campos obrigatórios estiverem vazios", async ({
  page,
}) => {
  await page.login.submitLoginForm("admin@zombieplus.com", "pwd123", "Admin");

  await page.movies.goForm();
  await page.movies.submit();
  await page.movies.alertHaveText([
    "Por favor, informe o título.",
    "Por favor, informe a sinopse.",
    "Por favor, informe a empresa distribuidora.",
    "Por favor, informe o ano de lançamento.",
  ]);
});
