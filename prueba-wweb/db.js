const mysql2 = require("mysql2/promise");
const config = require("./config.js");

const pool = mysql2.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  database: config.DB_DATABASE,
});

module.exports = { pool };
