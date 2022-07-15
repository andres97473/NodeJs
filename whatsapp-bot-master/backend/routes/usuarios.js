const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const {
  getUsuarios,
  crearUsuarios,
  actualizarFechaVencimiento,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", validarJWT, getUsuarios);
router.post(
  "/",
  [
    validarJWT,
    validarADMIN_ROLE,
    check("nombre1", "El nombre es obligatorio").not().isEmpty(),
    check("apellido1", "El apellido es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuarios
);
router.put(
  "/:email",
  [
    validarJWT,
    validarADMIN_ROLE,
    check("vence", "La nueva fecha de vencimiento es obligatoria")
      .not()
      .isEmpty(),
    validarCampos,
  ],
  actualizarFechaVencimiento
);

module.exports = router;
