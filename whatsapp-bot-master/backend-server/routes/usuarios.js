const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  deleteUsuario,
  actualizarFechaVencimiento,
  actualizarMensajesDisponibles,
} = require("../controllers/usuarios");
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getUsuarios);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraeña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  "/:id",
  [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:id", [validarJWT, validarADMIN_ROLE], deleteUsuario);

// actualizar datos de mensajes
router.put(
  "/mensajes-fecha/:email",
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
router.put(
  "/mensajes-disponibles/:email",
  [
    validarJWT,
    validarADMIN_ROLE,
    check("disponibles", "Es necesario indicar un valor").not().isEmpty(),
    validarCampos,
  ],
  actualizarMensajesDisponibles
);

module.exports = router;
