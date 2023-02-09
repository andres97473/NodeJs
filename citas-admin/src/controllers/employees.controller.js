import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM employee");
  res.json(rows);
};

export const getEmployeeId = async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query("SELECT * FROM employee where id = ?", id);

  if (rows.length <= 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(rows[0]);
};

export const createEmployee = async (req, res) => {
  const { name, salary } = req.body;
  const [rows] = await pool.query(
    "INSERT INTO employee (name, salary) VALUES (?,?)",
    [name, salary]
  );

  res.send({ id: rows.insertId, name, salary });
};

export const updateEmployee = (req, res) => res.send("Actualizando empleado");

export const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  const [result] = await pool.query("DELETE FROM employee where id = ?", id);

  if (result.affectedRows <= 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json({ message: "Employee Delete" });
};
