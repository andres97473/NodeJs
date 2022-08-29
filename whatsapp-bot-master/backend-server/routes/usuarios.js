const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  deleteUsuario,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", getUsuarios);
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
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:id", deleteUsuario);

module.exports = router;
