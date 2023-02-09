import { Router } from "express";
import {
  getEmployees,
  getEmployeeId,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employees.controller.js";

const router = Router();

router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployeeId);
router.post("/employees", createEmployee);
router.put("/employees", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

export default router;
