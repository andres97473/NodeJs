const { Router } = require("express");
const { getMensajes } = require("../controllers/mensajes");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getMensajes);

module.exports = router;
