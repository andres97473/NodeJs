const router = require("express").Router();
const { HistoriaController } = require("../controllers");

router.get("/historias", HistoriaController.index);
router.get("/historias-api", HistoriaController.historias);
router.get("/historias/:historia", HistoriaController.historiasPaciente);
router.get("/historias-codigos", HistoriaController.codigos);
router.get("/historias-especialidad", HistoriaController.especialidad);
router.get("/historias-tipo-atencion", HistoriaController.tipoAtencion);
router.post("/historias-firmas", HistoriaController.getFirmas);

module.exports = router;
