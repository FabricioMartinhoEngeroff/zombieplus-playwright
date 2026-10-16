require("dotenv").config();
const { expect } = require("@playwright/test");

class Api {
  constructor(request) {
    this.baseApi = process.env.BASE_API;
    this.request = request;
    this.token = undefined;
  }

  async setToken() {
    const response = await this.request.post(this.baseApi + "/sessions", {
      data: {
        email: "admin@zombieplus.com",
        password: "pwd123",
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = JSON.parse(await response.text());
    this.token = `Bearer ${body.token}`;
  }

  async getCompanyIdByName(companyName) {
    const response = await this.request.get(this.baseApi + "/companies", {
      headers: {
        Authorization: this.token,
      },
      params: {
        name: companyName,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = JSON.parse(await response.text());

    // Se a distribuidora não existir, a API devolve data vazio e body.data[0].id
    // estoura com "Cannot read properties of undefined (reading 'id')", que não
    // diz qual foi o problema. Esse expect falha antes, com o nome da distribuidora
    // na mensagem (ex.: um erro de digitação como "Universal Picturess" na fixture).
    // Usada por postMovie e postTvShow: as distribuidoras são as mesmas para os dois.
    expect(
      body.data.length,
      `Distribuidora não encontrada: ${companyName}`
    ).toBeGreaterThan(0);

    return body.data[0].id;
  }

  async postMovie(movie) {
    const companyId = await this.getCompanyIdByName(movie.company);

    const response = await this.request.post(this.baseApi + "/movies", {
      // Sem Content-Type manual: com a opção multipart o Playwright já gera
      // "multipart/form-data; boundary=..." sozinho. A chave antiga "ContentType"
      // (sem hífen) nem era um cabeçalho válido, só era enviada como lixo.
      headers: {
        Authorization: this.token,
        Accept: "application/json, text/plain, */*",
      },
      multipart: {
        title: movie.title,
        overview: movie.overview,
        company_id: companyId,
        release_year: movie.release_year,
        featured: movie.featured,
      },
    });

    // Mesmo padrão do postTvShow: se falhar, a mensagem mostra o status e o corpo
    // da resposta (ex.: 400 com o motivo), em vez de só "expected true, received false".
    expect(
      response.ok(),
      `POST /movies falhou: ${response.status()} ${await response.text()}`
    ).toBeTruthy();
  }

  async postTvShow(tvshow) {
    const companyId = await this.getCompanyIdByName(tvshow.company);

    const response = await this.request.post(this.baseApi + "/tvshows", {
      headers: {
        Authorization: this.token,
        Accept: "application/json, text/plain, */*",
      },
      multipart: {
        title: tvshow.title,
        overview: tvshow.overview,
        company_id: companyId,
        release_year: tvshow.release_year,
        seasons: tvshow.seasons,
        featured: tvshow.featured,
      },
    });

    expect(
      response.ok(),
      `POST /tvshows falhou: ${response.status()} ${await response.text()}`
    ).toBeTruthy();
  }
}

module.exports = { Api };
