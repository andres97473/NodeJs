const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getNotificaciones,
  crearNotificacion,
  verNotificacion,
} = require("../controllers/notificaciones");

const router = Router();

router.get("/", validarJWT, getNotificaciones);
router.post("/", validarJWT, crearNotificacion);
router.put("/ver/:id", validarJWT, verNotificacion);

module.exports = router;
