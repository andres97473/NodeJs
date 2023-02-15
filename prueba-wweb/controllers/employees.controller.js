const { pool } = require("../db.js");

const getEmployees = async () => {
  try {
    return ([rows] = await pool.query("SELECT * FROM employee"));
  } catch (error) {
    return console.log(error);
  }
};

module.exports = { getEmployees };
