const { test } = require("../support");
const { Login } = require("../support/actions/Login");
const { Movies } = require("../support/actions/Movies");

test("deve logar como administrador", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "pwd123");
  await page.login.isLoggedIn("Admin");
});

test("não deve logar com senha incorreta", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "wrongpassword");
  await page.popup.haveText(
    "Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.",
  );
});

test("não deve logar quando o email é inválido", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("emailinvalido", "wrongpassword");
  await page.popup.haveText("Email incorreto");
});

test("não deve logar quando o email não é preenchido", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("", "wrongpassword");
  await page.popup.haveText("Campo obrigatório");
});

test("não deve logar quando a senha não é preenchida", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("admin@zombieplus.com", "", "Campo obrigatório");
  await page.popup.haveText("Campo obrigatório");
});

test("não deve logar quando nenhum campo é preenchido", async ({ page }) => {
  await page.login.visit();
  await page.login.submitLoginForm("", "");
  await page.popup.haveText(["Campo obrigatório", "Campo obrigatório"]);
});
