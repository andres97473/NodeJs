const { Router } = require("express");
const { getPaises } = require("../controllers/paises");

const router = Router();

router.get("/", getPaises);

module.exports = router;
