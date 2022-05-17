const { Router } = require("express");
const { getClientes, borrarCliente } = require("../controllers/clientes");

const router = Router();

router.get("/", getClientes);
router.delete("/:id", borrarCliente);

module.exports = router;
