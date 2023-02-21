const {
  getTurnosCitas,
  getCitas,
  compararCitas,
} = require("./controllers/citas.controller.js");

var turnosCitas = [];
var citasAsignadas = [];

const buscarDisponibles = async () => {
  const fecha = "2023-02-01";
  getTurnosCitas(fecha)
    .then((turnos) => {
      turnosCitas = turnos;
      // console.log(turnosCitas);
    })
    .catch((err) => {
      console.log(err);
    });

  getCitas(fecha)
    .then((citas) => {
      citasAsignadas = citas[0];
      // console.log(citasAsignadas);
      compararCitas(turnosCitas, citasAsignadas)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

buscarDisponibles()
  .then()
  .catch((err) => {
    console.log(err);
  });
