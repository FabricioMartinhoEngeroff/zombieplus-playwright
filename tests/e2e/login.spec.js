const { test } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { Toast } = require("../pages/components");
const { MoviesPage } = require("../pages/MoviesPage");

let loginPage;
let toast;
let moviesPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  toast = new Toast(page);
  moviesPage = new MoviesPage(page);
});

test("deve logar como administrador", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("admin@zombieplus.com", "pwd123");
  await moviesPage.isLoggedIn();
});

test("não deve logar com senha incorreta", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("admin@zombieplus.com", "wrongpassword");
  await toast.haveText("Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.");
});

test("não deve logar quando o email é inválido", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("123@fa.com.br", "wrongpassword");
  await loginPage.alertHaveText("Email incorreto");
});

test("não deve logar quando o email não é preenchido", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("", "wrongpassword");
  await loginPage.alertHaveText("Campo obrigatório");
});

test("não deve logar quando a senha não é preenchida", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("admin@zombieplus.com", "");
  await loginPage.alertHaveText("Campo obrigatório");
});

test("não deve logar quando nenhum campo é preenchido", async () => {
  await loginPage.visit();
  await loginPage.submitLoginForm("", "");
  await loginPage.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});