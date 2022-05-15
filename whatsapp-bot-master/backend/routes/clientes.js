const { Router } = require("express");
const { getClientes } = require("../controllers/clientes");

const router = Router();

router.get("/", getClientes);

module.exports = router;
