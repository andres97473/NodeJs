const moment = require("moment");
const { pool } = require("../db.js");

// constantes
const formatDate = "YYYY-MM-DD hh:mmA";
// const fechaPrueba = "2023-02-01";

// cambiar dias
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

const fechaString = (string) => {
  return string.substr(0, string.length - 2) + " " + string.slice(-2);
};

/**
 * @param fecha y hora inicial del rango
 * @param  fecha y hora final del rango
 * @param  fecha y hora a comparar
 */
const validarFechaEnRango = (fechaInicio, fechaFin, fechaValidar) => {
  const fechaInicioMs = fechaInicio.getTime();
  const fechaFinMs = fechaFin.getTime();
  const fechaValidarMs = fechaValidar.getTime();

  if (fechaValidarMs >= fechaInicioMs && fechaValidarMs <= fechaFinMs) {
    return true;
  } else {
    return false;
  }
};

// comparar arrays por id y fecha_string
const compararCitas = async (data1, data2) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};

// comparar arrays dentro de rango
const compararBloqueos = async (data1, data2) => {
  try {
    var array = [];
    for (var i = 0; i < data1.length; i++) {
      var igual = false;
      for (var j = 0; (j < data2.length) & !igual; j++) {
        if (
          data1[i]["id_profesional"] == data2[j]["id_profesional"] &&
          validarFechaEnRango(
            new Date(fechaString(data2[j]["inicio_bloqueo"])),
            new Date(fechaString(data2[j]["fin_bloqueo"])),
            new Date(fechaString(data1[i]["fecha_string"]))
          )
        )
          igual = true;
      }
      if (!igual) array.push(data1[i]);
    }
    // console.log(array);
    return array;
  } catch (error) {
    console.log(error);
  }
};

// get dias festivos
const getFestivos = async (fecha) => {
  try {
    return ([rows] = await pool.query(
      `SELECT fs.fec_festivo
      FROM tb_festivos AS fs
      WHERE fs.fec_festivo = ?`,
      [fecha]
    ));
  } catch (error) {
    return console.log(error);
  }
};

// get usuario por docuemnto
const getUsuarioDocumento = async (documento) => {
  try {
    return ([rows] = await pool.query(
      `SELECT us.id_usr_salud, us.num_doc_usr, us.apellido1, us.apellido2, us.nombre1, us.nombre2
      FROM adm_usuarios AS us
      WHERE us.num_doc_usr = ?`,
      [documento]
    ));
  } catch (error) {
    return console.log(error);
  }
};

// get turnos por dia
const getTurnos = async (fecha) => {
  try {
    return ([rows] = await pool.query(
      `SELECT tu.id_turno, tu.hora_inicio, tu.hora_fin, tu.tiempo, tu.id_dia,
       tu.id_profesional, CONCAT_WS(' ', su.nombre1, su.nombre2, su.apellido1, su.apellido2 ) AS profesional, 
       es.id_especialidad ,es.descripcion_especialidad AS especialidad ,su.estado 
       FROM tb_turnos AS tu 
       INNER JOIN seg_usuarios_sistema AS su ON ( su.id_usuario = tu.id_profesional )
       INNER JOIN seg_especialidades_usuario AS eu ON ( eu.id_usuario = su.id_usuario )
       INNER JOIN tb_especialidades AS es ON ( es.id_especialidad = eu.id_especialidad )
       WHERE tu.id_dia = ? AND su.estado = 1 AND es.id_especialidad IN (1) AND su.descripcion NOT LIKE '%URGENCIA%'`,
      [diaFecha(fecha)]
    ));
  } catch (error) {
    return console.log(error);
  }
};

// get turnos por dia
const getTurnosProfesional = async (id, fecha) => {
  try {
    return ([rows] = await pool.query(
      `SELECT tu.id_turno, tu.hora_inicio, tu.hora_fin, tu.tiempo, tu.id_dia,
       tu.id_profesional, CONCAT_WS(' ', su.nombre1, su.nombre2, su.apellido1, su.apellido2 ) AS profesional, 
       es.id_especialidad ,es.descripcion_especialidad AS especialidad ,su.estado 
       FROM tb_turnos AS tu 
       INNER JOIN seg_usuarios_sistema AS su ON ( su.id_usuario = tu.id_profesional )
       INNER JOIN seg_especialidades_usuario AS eu ON ( eu.id_usuario = su.id_usuario )
       INNER JOIN tb_especialidades AS es ON ( es.id_especialidad = eu.id_especialidad )
       WHERE tu.id_profesional =? AND tu.id_dia = ? AND su.estado = 1 AND es.id_especialidad IN (1) AND su.descripcion NOT LIKE '%URGENCIA%'`,
      [id, diaFecha(fecha)]
    ));
  } catch (error) {
    return console.log(error);
  }
};

// get citas por dia
const getCitas = async (fecha) => {
  try {
    return ([rows] = await pool.query(
      `SELECT ac.id_cita,CONCAT_WS(' ',ac.fec_cita, ac.hor_cita) AS fecha_string, ac.estado AS id_estado,
      adm_estados_citas.descripcion_est_cita AS estado,
      su.id_usuario AS id_profesional, CONCAT_WS(' ', su.nombre1, su.nombre2, su.apellido1, su.apellido2 ) AS profesional
      FROM adm_citas AS ac
      INNER JOIN adm_estados_citas ON (adm_estados_citas.id=ac.estado)
      INNER JOIN seg_usuarios_sistema AS su ON (su.id_usuario=ac.id_profesional)
      WHERE ac.fec_cita = ? AND ac.estado != 4 AND ac.id_especialidad IN (1)`,
      [fecha]
    ));
  } catch (error) {
    return console.log(error);
  }
};

const getBloqueos = async (fecha) => {
  try {
    return ([rows] = await pool.query(
      `SELECT bl.id_bloqueo, 
      CONCAT_WS(' ',bl.fec_bloqueo, bl.desde_m) AS inicio_bloqueo,
      CONCAT_WS(' ',bl.fec_bloqueo, bl.hasta_m) AS fin_bloqueo,
      bl.motivo, bl.id_profesional, CONCAT_WS(' ', su.nombre1, su.nombre2, su.apellido1, su.apellido2 ) AS profesional
      FROM adm_bloqueos AS bl
      INNER JOIN seg_usuarios_sistema AS su ON ( su.id_usuario = bl.id_profesional )
      WHERE bl.fec_bloqueo = ?`,
      [fecha]
    ));
  } catch (error) {
    return console.log(error);
  }
};

// convertir turnos en citas posibles para el dia
const getTurnosCitas = async (fecha) => {
  try {
    var citas_disponibles = [];

    const rows = await getTurnos(fecha);

    const turnos = rows[0];

    for (const turno of turnos) {
      // console.log(turno);
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

      // console.log(
      //   "inicio " +
      //     inicio_turno.toLocaleString() +
      //     " fin " +
      //     fin_turno.toLocaleString()
      // );

      while (inicio_turno <= fin_turno) {
        // push array
        // console.log(inicio_turno.toLocaleString());
        citas_disponibles.push({
          fecha_string: moment(inicio_turno).format(formatDate),
          tiempo: turno.tiempo,
          id_profesional: turno.id_profesional,
          profesional: turno.profesional,
          id_especialidad: turno.id_especialidad,
          especialidad: turno.especialidad,
        });

        inicio_turno.setMinutes(inicio_turno.getMinutes() + turno.tiempo);
      }
    }
    // console.log(citas_disponibles);

    return citas_disponibles;
  } catch (error) {
    console.log(error);
  }
};

// convertir turnos en citas posibles para el dia por profesional
const getTurnosCitasProfesional = async (id, fecha) => {
  try {
    var citas_disponibles = [];

    const rows = await getTurnosProfesional(id, fecha);

    const turnos = rows[0];

    for (const turno of turnos) {
      // console.log(turno);
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

      // console.log(
      //   "inicio " +
      //     inicio_turno.toLocaleString() +
      //     " fin " +
      //     fin_turno.toLocaleString()
      // );

      while (inicio_turno <= fin_turno) {
        // push array
        // console.log(inicio_turno.toLocaleString());
        citas_disponibles.push({
          fecha_string: moment(inicio_turno).format(formatDate),
          tiempo: turno.tiempo,
          id_profesional: turno.id_profesional,
          profesional: turno.profesional,
          id_especialidad: turno.id_especialidad,
          especialidad: turno.especialidad,
        });

        inicio_turno.setMinutes(inicio_turno.getMinutes() + turno.tiempo);
      }
    }
    // console.log(citas_disponibles);

    return citas_disponibles;
  } catch (error) {
    console.log(error);
  }
};

// convierte citas disponibles y los agrupad por id_profesional
const convertirDisponibles = async (arrayRespuesta) => {
  try {
    var nuevoArray = [];
    var arrayTemporal = [];
    for (var i = 0; i < arrayRespuesta.length; i++) {
      arrayTemporal = nuevoArray.filter(
        (resp) => resp["id_profesional"] == arrayRespuesta[i]["id_profesional"]
      );
      if (arrayTemporal.length > 0) {
        nuevoArray[nuevoArray.indexOf(arrayTemporal[0])]["disponibles"].push({
          fecha_string: arrayRespuesta[i]["fecha_string"],
          especialidad: arrayRespuesta[i]["especialidad"],
        });
      } else {
        nuevoArray.push({
          id_profesional: arrayRespuesta[i]["id_profesional"],
          profesional: arrayRespuesta[i]["profesional"],
          especialidad: arrayRespuesta[i]["especialidad"],
          disponibles: [
            {
              fecha_string: arrayRespuesta[i]["fecha_string"],
              especialidad: arrayRespuesta[i]["especialidad"],
            },
          ],
        });
      }
    }

    return nuevoArray;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getTurnosCitas,
  getTurnosCitasProfesional,
  getCitas,
  getBloqueos,
  getFestivos,
  getUsuarioDocumento,
  compararCitas,
  compararBloqueos,
  convertirDisponibles,
};
