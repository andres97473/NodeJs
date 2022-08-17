const { Router } = require("express");
const {
  getMenus,
  crearMenu,
  getMenusTelefono,
} = require("../controllers/menus");

const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/:token", [validarJWT], getMenus);
router.get("/telefono/:celular", [validarJWT], getMenusTelefono);
router.post("/", [validarJWT], crearMenu);

module.exports = router;
