const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioPassword,
  cambiarEstado,
  deleteUsuario,
} = require("../controllers/usuarios");
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", [validarJWT, validarADMIN_ROLE], getUsuarios);
router.post(
  "/",
  [
    check("num_documento", "El numero de documento es obligatorio")
      .not()
      .isEmpty(),
    check("nombre1", "El primer nombre es obligatorio").not().isEmpty(),
    check("apellido1", "El primer apellido es obligatorio").not().isEmpty(),
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
    check("num_documento", "El numero de documento es obligatorio")
      .not()
      .isEmpty(),
    check("nombre1", "El primer nombre es obligatorio").not().isEmpty(),
    check("apellido1", "El primer apellido es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.put(
  "/desactivar/:id",
  [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("estado", "El estado es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  cambiarEstado
);

router.put(
  "/password/:id",
  [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("password", "la contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuarioPassword
);

router.delete("/:id", [validarJWT, validarADMIN_ROLE], deleteUsuario);

module.exports = router;
