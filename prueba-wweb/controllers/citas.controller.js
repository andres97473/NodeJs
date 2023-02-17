const { pool } = require("../db.js");

const diaFecha = (fecha) => {
  const dia = new Date(fecha);
  if (dia.getDay() === 6) {
    return 0;
  } else if (dia.getDay() === 0) {
    return 1;
  } else if (dia.getDay() === 1) {
    return 2;
  } else if (dia.getDay() === 2) {
    return 3;
  } else if (dia.getDay() === 3) {
    return 4;
  } else if (dia.getDay() === 4) {
    return 5;
  } else if (dia.getDay() === 5) {
    return 6;
  }
};

const getTurnos = async () => {
  fecha = "2023-02-01";
  try {
    return ([rows] = await pool.query(
      `SELECT tu.id_turno, tu.hora_inicio, tu.hora_fin, tu.tiempo, tu.id_dia, tu.id_profesional
       FROM tb_turnos as tu 
       WHERE tu.id_dia = ? AND tu.id_profesional= 21 
       LIMIT 2`,
      [diaFecha(fecha)]
    ));
  } catch (error) {
    return console.log(error);
  }
};

const getTurnosCitas = async () => {
  fecha = "2023-02-01";
  var citas_disponibles = [];
  getTurnos()
    .then((citas) => {
      const turnos = citas[0];

      for (const turno of turnos) {
        console.log(turno);
        var inicio_turno = new Date(
          fecha +
            " " +
            turno.hora_inicio.slice(0, 5) +
            " " +
            turno.hora_inicio.slice(-2)
        );

        var fin_turno = new Date(
          fecha +
            " " +
            turno.hora_fin.slice(0, 5) +
            " " +
            turno.hora_fin.slice(-2)
        );
        while (inicio_turno <= fin_turno) {
          console.log(
            inicio_turno.getHours() + ":" + inicio_turno.getMinutes()
          );
          inicio_turno.setMinutes(inicio_turno.getMinutes() + turno.tiempo);
        }
      }
    })
    .catch((err) => {
      console(err);
    });
};

module.exports = { getTurnos, getTurnosCitas };
