const router = require("express").Router();
const { HistoriaController } = require("../controllers");

router.get("/historias", HistoriaController.index);

module.exports = router;
