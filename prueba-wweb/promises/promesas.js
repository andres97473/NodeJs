const {
  getTurnosCitas,
  getCitas,
  getBloqueos,
  compararCitas,
  compararBloqueos,
  convertirDisponibles,
} = require("../controllers/citas.controller.js");

async function getCitasDisponibles(fecha) {
  try {
    const turnosCitas = await getTurnosCitas(fecha);
    const citas = await getCitas(fecha);
    const bloqueos = await getBloqueos(fecha);

    const disponiblesCitas = await compararCitas(turnosCitas, citas[0]);

    //TODO: error al comparar bloqueos
    const disponiblesBloqueos = await compararBloqueos(
      disponiblesCitas,
      bloqueos[0]
    );
    // console.log(disponiblesBloqueos);

    const arrayConvertido = await convertirDisponibles(disponiblesBloqueos);
    return arrayConvertido;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCitasDisponibles,
};

getCitasDisponibles("2023-02-09")
  .then((res) => {
    for (const profesionales of res) {
      console.log(profesionales.profesional);

      for (const cita of profesionales.disponibles) {
        console.log(cita);
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

// getCitasDisponibles("2023-02-09")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
