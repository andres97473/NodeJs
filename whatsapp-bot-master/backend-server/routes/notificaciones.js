const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getNotificaciones,
  crearNotificacion,
} = require("../controllers/notificaciones");

const router = Router();

router.get("/", validarJWT, getNotificaciones);
router.post("/", validarJWT, crearNotificacion);

module.exports = router;
