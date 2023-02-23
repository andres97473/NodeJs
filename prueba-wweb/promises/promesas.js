const {
  getTurnosCitas,
  getCitas,
  getBloqueos,
  compararCitas,
  compararBloqueos,
} = require("../controllers/citas.controller.js");

async function getDisponiblesAsync(req, res) {
  try {
    const turnosCitas = await getTurnosCitas(req);
    const citas = await getCitas(req);
    const bloqueos = await getBloqueos(req);

    const disponiblesCitas = await compararCitas(turnosCitas, citas[0]);
    const disponiblesBloqueos = await compararBloqueos(
      disponiblesCitas,
      bloqueos[0]
    );

    return disponiblesBloqueos;
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getDisponiblesAsync,
};
