const resultado = require("../myfile.json");

class HistoriaController {
  async index(req, res) {
    res.json({ resultado });
  }
}

module.exports = new HistoriaController();
