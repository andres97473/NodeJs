const { Router } = require("express");
const { getPlanes, crearPlan } = require("../controllers/planes");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarADMIN_ROLE } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");

const router = Router();

router.get("/", validarJWT, getPlanes);
router.post(
  "/",
  [
    validarJWT,
    validarADMIN_ROLE,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "la descripcion es obligatoria").not().isEmpty(),
    check("valor", "El valor es obligatorio").not().isEmpty(),
    check("orden", "El orden es obligatorio").not().isEmpty(),
    check("tipo", "El tipo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearPlan
);

module.exports = router;
