const router = require("express").Router();
const { AuthController } = require("../controllers");

router.get("/auth", AuthController.index);
router.get("/usuarios", AuthController.usuarios);
router.get("/usuarios/:id", AuthController.usuarioId);

module.exports = router;
