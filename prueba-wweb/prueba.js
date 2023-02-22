const {
  getTurnosCitas,
  getCitas,
  getBloqueos,
  compararCitas,
  compararBloqueos,
} = require("./controllers/citas.controller.js");

const buscarDisponibles = async (fecha) => {
  var turnosCitas = [];
  var citasAsignadas = [];

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
          getBloqueos(fecha)
            .then((bloqueos) => {
              bloqueosTurnos = bloqueos[0];
              compararBloqueos(res, bloqueosTurnos)
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
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

buscarDisponibles("2023-02-08")
  .then()
  .catch((err) => {
    console.log(err);
  });
