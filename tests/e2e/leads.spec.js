const { test, expect } = require("../support");
const { faker } = require("@faker-js/faker");

test("deve cadastrar um lead na fila de espera", async (page) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);
  await page.toast.containText(
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!",
  );
});

test("não deve cadastrar quando o email já existe", async ({
  request,
  page,
}) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await request.post("http://localhost:3333/leads", {
    data: {
      name: leadName,
      email: leadEmail,
    },
  });

  expect(leadEmail).toBeTruthy();
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  await page.toast.containText(
    "O endereço de e-mail fornecido já está registrado em nossa fila de espera.",
  );
});

test("não deve cadastrar com e-mail incorreto", async (page) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Fernando Papito", "emailinvalido");
  await page.leads.alertHaveText("Email incorreto");
});

test("não deve cadastrar quando o nome não é preenchido", async (page) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "fa.engeroff@gmail.com");
  await page.leads.alertHaveText("Campo obrigatório");
});

test("não deve cadastrar quando o email não é preenchido", async (page) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Fabricio3", "");
  await page.leads.alertHaveText("Campo obrigatório");
});

test("não deve cadastrar quando nenhum campo é preenchido", async (page) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "");
  await page.leads.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
