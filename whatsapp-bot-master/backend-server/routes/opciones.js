const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getOpciones,
  crearOpcion,
  deleteOpcion,
} = require("../controllers/opciones");

const router = Router();

router.get("/:id", validarJWT, getOpciones);
router.post("/", validarJWT, crearOpcion);
router.delete("/:id", validarJWT, deleteOpcion);

module.exports = router;
