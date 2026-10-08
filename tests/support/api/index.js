const { expect } = require("@playwright/test");

export class Api {
  constructor(request) {
    this.request = request;
    this.token = undefined;
  }

  async setToken() {
    const response = await this.request.post("http://localhost:3333/sessions", {
      data: {
        email: "admin@zombieplus.com",
        password: "pwd123",
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = JSON.parse(await response.text());
    this.token = body.token;
  }

  async postMovie(movie) {
    await this.setToken();

    const response = await this.request.post("http://localhost:3333/movies", {
      headers: {
        Authorization: this.token,
        ContentType: "multipart/form-data",
        Accept: "application/json, text/plain, */*",
      },
      multipart: {
        title: movie.title,
        overview: movie.overview,
        company_id: "c3ac740d-5e00-4d97-bae5-78825651c963",
        release_year: movie.release_year,
        featured: movie.featured,
      },
    });

    expect(response.ok()).toBeTruthy();
  }
}
