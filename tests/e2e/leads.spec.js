const { test } = require("@playwright/test");
const { faker } = require("@faker-js/faker");

const { LandingPage } = require("../pages/LandingPage");
const { Toast } = require("../pages/components");

let landingPage;
let toast;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page);
});

test("deve cadastrar um lead na fila de espera", async () => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(leadName, leadEmail);
  await toast.haveText(
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!",
  );
});

test("não deve cadastrar com e-mail incorreto", async () => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("Fernando Papito", "test.com.br");
  await landingPage.alertHaveText("Email incorreto");
});

test("não deve cadastrar quando o nome não é preenchido", async () => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("", "fa.engeroff@gmail.com");
  await landingPage.alertHaveText("Campo obrigatório");
});

test("não deve cadastrar quando o email não é preenchido", async () => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("Fabricio3", "");
  await landingPage.alertHaveText("Campo obrigatório");
});

test("não deve cadastrar quando nenhum campo é preenchido", async () => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm("", "");
  await landingPage.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
