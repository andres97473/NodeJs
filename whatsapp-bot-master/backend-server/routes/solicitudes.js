const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarADMIN_ROLE } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const {
  crearSolicitud,
  getSolicitudID,
  enviarSoportePago,
  cancelarSolicitud,
} = require("../controllers/solicitudes");

const router = Router();

router.get("/:id", [validarJWT], getSolicitudID);

router.post(
  "/",
  [
    validarJWT,
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "la descripcion es obligatoria").not().isEmpty(),
    check("valor", "El valor es obligatorio").not().isEmpty(),
    check("tipo", "El tipo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearSolicitud
);

router.put(
  "/enviado/:id",
  [
    validarJWT,
    check("estado", "El estado es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  enviarSoportePago
);

router.delete("/enviado/:id", [validarJWT], cancelarSolicitud);

module.exports = router;