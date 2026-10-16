require("dotenv").config();

const { Client } = require("pg");

const DbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

async function executeSQL(sqlScript) {
  const client = new Client(DbConfig);

  try {
    await client.connect();
    const result = await client.query(sqlScript);
    return result.rows;
  } catch (error) {
    throw new Error(`Erro ao executar SQL: ${sqlScript}\n${error.message}`);
  } finally {
    await client.end();
  }
}

module.exports = { executeSQL };
