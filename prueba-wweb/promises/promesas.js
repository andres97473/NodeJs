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

const fecha = "2023-03-02";

getCitasDisponibles(fecha)
  .then((res) => {
    const nFecha = new Date(fecha + "T00:00");
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // console.log(nFecha.toLocaleDateString("es-ES", options));
    var mensaje =
      "La siguiente informacion corresponde al dia " +
      nFecha.toLocaleDateString("es-ES", options);
    for (const profesionales of res) {
      // console.log(profesionales);
      mensaje =
        mensaje +
        "\n\n" +
        "Profesional de " +
        profesionales.especialidad +
        " " +
        profesionales.profesional;
      for (const cita of profesionales.disponibles) {
        // console.log(cita);
        mensaje = mensaje + "\n";
        mensaje =
          mensaje + "-> Cita disponible para el dia " + cita.fecha_string;
        mensaje = mensaje + "\n";
        mensaje = mensaje + "---------------------------";
      }
    }
    console.log(mensaje);
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
