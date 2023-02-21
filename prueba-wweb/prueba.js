const {
  getTurnosCitas,
  getCitas,
} = require("./controllers/citas.controller.js");

var turnosCitas = [];
var citasAsignadas = [];

// comparar arrays por id y fecha_string
const compararCitas = async (data1, data2) => {
  var array = [];
  for (var i = 0; i < data1.length; i++) {
    var igual = false;
    for (var j = 0; (j < data2.length) & !igual; j++) {
      if (
        data1[i]["id_profesional"] == data2[j]["id_profesional"] &&
        data1[i]["fecha_string"] == data2[j]["fecha_string"]
      )
        igual = true;
    }
    if (!igual) array.push(data1[i]);
  }
  // console.log(array);
  return array;
};

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
