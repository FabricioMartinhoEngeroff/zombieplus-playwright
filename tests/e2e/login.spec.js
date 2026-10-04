const { test } = require("../support");
const { LoginPage } = require("../pages/LoginPage");
const { MoviesPage } = require("../pages/MoviesPage");


test("deve logar como administrador", async (page) => {

  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "pwd123");
  await page.movies.isLoggedIn();
});

test("não deve logar com senha incorreta", async (page) => {
  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "wrongpassword");
  await page.toast.haveText("Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.");
});

test("não deve logar quando o email é inválido", async (page) => {
  await page.login.visit();
  await page.login.submitLoginForm("emailinvalido", "wrongpassword");
  await page.login.alertHaveText("Email incorreto");
});

test("não deve logar quando o email não é preenchido", async (page) => {
  await page.login.visit();
  await page.login.submitLoginForm("", "wrongpassword");
  await page.login.alertHaveText("Campo obrigatório");
});

test("não deve logar quando a senha não é preenchida", async (page) => {
  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "");
  await page.login.alertHaveText("Campo obrigatório");
});

test("não deve logar quando nenhum campo é preenchido", async (page) => {
  await page.login.visit();
  await page.login.submitLoginForm("", "");
  await page.login.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});