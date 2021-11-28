const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "admin",
  database: "registro",
});

module.exports = pool;
