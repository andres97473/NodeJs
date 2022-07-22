const { Router } = require("express");
const {
  getClientes,
  crearCliente,
  actualizarCliente,
  borrarCliente,
  getClientesToken,
} = require("../controllers/clientes");

const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", getClientes);
router.get("/token", [validarJWT], getClientesToken);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", borrarCliente);

module.exports = router;
