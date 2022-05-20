const { Router } = require("express");
const {
  getClientes,
  crearCliente,
  actualizarCliente,
  borrarCliente,
} = require("../controllers/clientes");

const router = Router();

router.get("/", getClientes);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", borrarCliente);

module.exports = router;
