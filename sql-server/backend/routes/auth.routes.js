const { check } = require("express-validator");
const { AuthController } = require("../controllers");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = require("express").Router();

router.get("/auth", AuthController.index);
router.get("/usuarios", AuthController.usuarios);
router.post(
  "/usuarios/login",
  [
    check("identificacion", "El identificacion es obligatorio").not().isEmpty(),
    check("contraseña", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  AuthController.usuarioId
);

router.get("/usuarios/login/renew", [validarJWT], AuthController.renewToken);
// router.get("/usuarios/login/renew", [validarJWT], renewToken);

module.exports = router;
