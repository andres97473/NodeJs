const router = require("express").Router();
const { HistoriaController } = require("../controllers");

router.get("/historias", HistoriaController.index);
router.get("/historias-api", HistoriaController.historias);
router.get("/historias/:historia", HistoriaController.historiasPaciente);
router.get("/historias-codigos", HistoriaController.codigos);

module.exports = router;
