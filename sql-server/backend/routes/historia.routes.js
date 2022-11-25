const router = require("express").Router();
const { HistoriaController } = require("../controllers");

router.get("/historias", HistoriaController.index);
router.get("/historias-api", HistoriaController.historias);
router.get("/historias/:historia", HistoriaController.historiasPaciente);
router.get("/historias-codigos", HistoriaController.codigos);
router.get("/historias-especialidad", HistoriaController.especialidad);
router.get("/historias-tipo-atencion", HistoriaController.tipoAtencion);
router.get(
  "/historias-archivos/:folder1/:folder2/:folder3/:folder4/:folder5/:archivo",
  HistoriaController.getArchivos
);
router.post("/historias-archivos", HistoriaController.postArchivos);

module.exports = router;
