const moment = require("moment");
const { pool } = require("../db.js");

// constantes
const formatDate = "YYYY-MM-DD hh:mmA";
// const fechaPrueba = "2023-02-01";

/**
 * Obtener dia de semana segun formato de cronhis a partir de una fecha
 * @param  {string} fecha Fecha en formato string
 * @returns {number}
 */
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

/**
 * Retorna fecha en formato string
 * @param  {string} fecha Fecha en formato string
 * @returns {string}
 */
const fechaString = (string) => {
  return string.substr(0, string.length - 2) + " " + string.slice(-2);
};

/**
 * Validar que una fecha este dentro de un rango de fechas
 * @param  {Date} fechaInicio Fecha de incio del rango
 * @param  {Date} fechaFin Fecha de fin del rango
 * @param  {Date} fechaValidar Fecha que se requiere que este dentro del rango
 * @returns {boolean}
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

/**
 * Comparar arrays por id y fecha_string
 * @param {array} data1 array con la informacion
 * @param {array} data2 array del que se van a quitar los elementos al array 1
 * @returns {array}
 */
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

/**
 * Comparar arrays dentro de rango
 * @param {array} data1 array con la informacion
 * @param {array} data2 array del que se van a quitar los elementos al array 1
 * @returns {array}
 */
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

/**
 * get dias festivos
 * @param {string} fecha que se busca si es un festivo
 */
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

/**
 * get usuario por documento
 * @param {string} documento que se busca si esta en la base de datos
 */
const getUsuarioDocumento = async (documento) => {
  try {
    return ([rows] = await pool.query(
      `SELECT us.id_usr_salud, us.num_doc_usr, us.apellido1, us.apellido2, us.nombre1, us.nombre2, us.estado
      FROM adm_usuarios AS us
      WHERE us.num_doc_usr = ?`,
      [documento]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * get turnos por dia
 * @param {string} fecha que se busca los turnos de los profesionales
 */
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

/**
 * get turnos de un profesional por dia
 * @param {int} id del profesional que se buscan los turnos
 * @param {string} fecha que se busca los turnos de los profesionales
 */
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

/**
 * get citas por dia
 * @param {string} fecha de las citas de un dia
 */
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

/**
 * Obtener inasistencias de un usuario
 * @param {string} documento numero de documento del usuario del que se buscan inasistencias
 */
const getCitasInasistentesDocumento = async (documento) => {
  try {
    return ([rows] = await pool.query(
      `SELECT adm_usuarios.id_usr_salud, adm_usuarios.num_doc_usr,tb_tipo_documento.tipo_doc,adm_usuarios.apellido1,adm_usuarios.apellido2,adm_usuarios.nombre1,adm_usuarios.nombre2,
      adm_citas.fec_cita,adm_citas.hor_cita,TIMESTAMPDIFF(DAY,adm_citas.fec_solicitud,adm_citas.fec_cita) AS 'dias_espera',
      tb_especialidades.descripcion_especialidad AS especialidad, profesional.id_usuario AS id_profesional,
      CONCAT_WS(' ',profesional.nombre1,profesional.nombre2,profesional.apellido1,profesional.apellido2) AS 'profesional',
      adm_estados_citas.descripcion_est_cita AS 'estado_cita',
      adm_motivoscancelacion.descripcion AS 'motivo_cancelacion'
      FROM adm_citas 
      INNER JOIN adm_usuarios ON (adm_usuarios.id_usr_salud=adm_citas.id_usr_cita) 
      INNER JOIN tb_eps ON (tb_eps.id_eps=adm_usuarios.id_eps) 
      INNER JOIN tb_especialidades ON (tb_especialidades.id_especialidad=adm_citas.id_especialidad)
      INNER JOIN tb_tipo_documento ON (tb_tipo_documento.id_tipo_doc=adm_usuarios.id_tipo_doc_usr) 
      INNER JOIN tb_regimenes ON (tb_regimenes.id_regimen=adm_usuarios.id_regimen)
      INNER JOIN seg_usuarios_sistema AS profesional ON (profesional.id_usuario=adm_citas.id_profesional)
      INNER JOIN seg_usuarios_sistema AS usuario_crea ON (usuario_crea.id_usuario=adm_citas.id_usr_crea)
      LEFT JOIN seg_usuarios_sistema AS usuario_confirma ON (usuario_confirma.id_usuario=adm_citas.id_usr_confirma)
      INNER JOIN adm_estados_citas ON (adm_estados_citas.id=adm_citas.estado)
      LEFT JOIN adm_motivoscancelacion ON (adm_citas.id_mot_cancelacion=adm_motivoscancelacion.id_motcancel)
      LEFT JOIN adm_ingresos ON (adm_ingresos.id_cita=adm_citas.id_cita)
      WHERE adm_citas.id_usr_cita<>0 
       AND tb_especialidades.id_especialidad = 1
       AND adm_usuarios.num_doc_usr = ?
       AND adm_motivoscancelacion.id_motcancel IN (1,10,25)
      ORDER BY adm_citas.fec_solicitud ASC,tb_especialidades.descripcion_especialidad`,
      [documento]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Obtener inasistencias de un numero de Whatsapp
 * @param  {string} whatsapp numero de whatsapp del usuario del que se buscan inasistencias
 */
const getCitasInasistentesWhatsapp = async (whatsapp) => {
  try {
    return ([rows] = await pool.query(
      `SELECT adm_usuarios.id_usr_salud, adm_usuarios.num_doc_usr,tb_tipo_documento.tipo_doc,adm_usuarios.apellido1,adm_usuarios.apellido2,adm_usuarios.nombre1,adm_usuarios.nombre2,
      adm_citas.fec_cita,adm_citas.hor_cita,TIMESTAMPDIFF(DAY,adm_citas.fec_solicitud,adm_citas.fec_cita) AS 'dias_espera',
      tb_especialidades.descripcion_especialidad AS especialidad, profesional.id_usuario AS id_profesional,
      CONCAT_WS(' ',profesional.nombre1,profesional.nombre2,profesional.apellido1,profesional.apellido2) AS 'profesional',
      adm_estados_citas.descripcion_est_cita AS 'estado_cita',
      adm_motivoscancelacion.descripcion AS 'motivo_cancelacion'
      FROM adm_citas 
      INNER JOIN adm_usuarios ON (adm_usuarios.id_usr_salud=adm_citas.id_usr_cita) 
      INNER JOIN tb_eps ON (tb_eps.id_eps=adm_usuarios.id_eps) 
      INNER JOIN tb_especialidades ON (tb_especialidades.id_especialidad=adm_citas.id_especialidad)
      INNER JOIN tb_tipo_documento ON (tb_tipo_documento.id_tipo_doc=adm_usuarios.id_tipo_doc_usr) 
      INNER JOIN tb_regimenes ON (tb_regimenes.id_regimen=adm_usuarios.id_regimen)
      INNER JOIN seg_usuarios_sistema AS profesional ON (profesional.id_usuario=adm_citas.id_profesional)
      INNER JOIN seg_usuarios_sistema AS usuario_crea ON (usuario_crea.id_usuario=adm_citas.id_usr_crea)
      LEFT JOIN seg_usuarios_sistema AS usuario_confirma ON (usuario_confirma.id_usuario=adm_citas.id_usr_confirma)
      INNER JOIN adm_estados_citas ON (adm_estados_citas.id=adm_citas.estado)
      LEFT JOIN adm_motivoscancelacion ON (adm_citas.id_mot_cancelacion=adm_motivoscancelacion.id_motcancel)
      LEFT JOIN adm_ingresos ON (adm_ingresos.id_cita=adm_citas.id_cita)
      WHERE adm_citas.id_usr_cita<>0 
       AND tb_especialidades.id_especialidad = 1
       AND adm_citas.whatsapp = ?
       AND adm_motivoscancelacion.id_motcancel IN (1,10,25)
      ORDER BY adm_citas.fec_solicitud ASC,tb_especialidades.descripcion_especialidad`,
      [whatsapp]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Obtener citas Activas mayores a la fecha actual
 * @param  {string} fecha fecha actual en formato string
 * @param  {string} documento numero de documento del usuario que del que se buscan las citas activas
 */
const getCitasActivasUsuario = async (fecha, documento) => {
  try {
    return ([rows] = await pool.query(
      `SELECT adm_usuarios.id_usr_salud, adm_usuarios.num_doc_usr,tb_tipo_documento.tipo_doc,adm_usuarios.apellido1,adm_usuarios.apellido2,adm_usuarios.nombre1,adm_usuarios.nombre2,
      adm_citas.fec_cita,adm_citas.hor_cita,TIMESTAMPDIFF(DAY,adm_citas.fec_solicitud,adm_citas.fec_cita) AS 'dias_espera',
      tb_especialidades.descripcion_especialidad AS especialidad, profesional.id_usuario AS id_profesional,
      CONCAT_WS(' ',profesional.nombre1,profesional.nombre2,profesional.apellido1,profesional.apellido2) AS 'profesional',
      adm_estados_citas.descripcion_est_cita AS 'estado_cita',
      adm_motivoscancelacion.descripcion AS 'motivo_cancelacion'
      FROM adm_citas 
      INNER JOIN adm_usuarios ON (adm_usuarios.id_usr_salud=adm_citas.id_usr_cita) 
      INNER JOIN tb_eps ON (tb_eps.id_eps=adm_usuarios.id_eps) 
      INNER JOIN tb_especialidades ON (tb_especialidades.id_especialidad=adm_citas.id_especialidad)
      INNER JOIN tb_tipo_documento ON (tb_tipo_documento.id_tipo_doc=adm_usuarios.id_tipo_doc_usr) 
      INNER JOIN tb_regimenes ON (tb_regimenes.id_regimen=adm_usuarios.id_regimen)
      INNER JOIN seg_usuarios_sistema AS profesional ON (profesional.id_usuario=adm_citas.id_profesional)
      INNER JOIN seg_usuarios_sistema AS usuario_crea ON (usuario_crea.id_usuario=adm_citas.id_usr_crea)
      LEFT JOIN seg_usuarios_sistema AS usuario_confirma ON (usuario_confirma.id_usuario=adm_citas.id_usr_confirma)
      INNER JOIN adm_estados_citas ON (adm_estados_citas.id=adm_citas.estado)
      LEFT JOIN adm_motivoscancelacion ON (adm_citas.id_mot_cancelacion=adm_motivoscancelacion.id_motcancel)
      LEFT JOIN adm_ingresos ON (adm_ingresos.id_cita=adm_citas.id_cita)
      WHERE tb_especialidades.id_especialidad = 1
       AND adm_citas.estado = 1
       AND adm_citas.fec_cita >= ?
       AND adm_usuarios.num_doc_usr = ?     
      ORDER BY adm_citas.fec_solicitud ASC,tb_especialidades.descripcion_especialidad`,
      [fecha, documento]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Obtener bloqueos para una fecha
 * @param  {string} fecha en formato string
 */
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

/**
 * Insertar una nueva cita para un usuario
 * @param {int} id_usr_cita id del usuario
 * @param {int} id_profesional id del profesional
 * @param {string} fec_cita fecha para la que va a quedar la cita AAAA-MM-DD
 * @param {string} hor_cita hora para la que va a quedar la cita HH:MM[AM/PM]
 * @param {string} fec_deseada fecha para la que el usuario quiere su cita AAAA-MM-DD
 * @param {string} fec_solicitud fecha actual en la que se hace la solicitud de la cita AAAA-MM-DD
 * @param {string} hor_solicitud hora actual en la que se hace la solicitud de la cita HH:MM[AM/PM]
 * @param {Date} fec_creacion fecha actual en la que se crea el registro AAAA-MM-DD HH:MM:SS
 * @param {string} whatsapp desde el cual se realiza el registro de la cita
 */
const insertCita = async (
  id_usr_cita,
  id_profesional,
  fec_cita,
  hor_cita,
  fec_deseada,
  fec_solicitud,
  hor_solicitud,
  fec_creacion,
  whatsapp
) => {
  try {
    return ([rows] = await pool.query(
      `INSERT INTO adm_citas
      (id_usr_cita,id_sede,id_profesional,id_especialidad,fec_cita,hor_cita,fec_deseada,
      fec_solicitud,hor_solicitud,descripcion,fec_creacion,id_cita_tipo,clase,origen,
      id_usr_crea,estado,id_cau_externa,id_programa,id_promotor,es_telefonica,
      id_modo,id_lugar,whatsapp)
      VALUES
      (?,1,?,1,?,?,?,?,?,'CITA ASIGNADA POR WHATSAPP',?,1,1,1,1,1,13,0,0,0,0,0,?)`,
      [
        id_usr_cita,
        id_profesional,
        fec_cita,
        hor_cita,
        fec_deseada,
        fec_solicitud,
        hor_solicitud,
        fec_creacion,
        whatsapp,
      ]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Obtener una cita por medio de su id
 * @param  {int} id de la cita que se desea buscar
 */
const getCitaId = async (id) => {
  try {
    return ([rows] = await pool.query(
      `SELECT ci.id_cita,ci.id_usr_cita,ci.fec_cita,ci.hor_cita, ci.fec_cancela,
      us.num_doc_usr,us.apellido1,us.apellido2,us.nombre1,us.nombre2,
      ci.descripcion,ci.estado,ci.whatsapp
      FROM adm_citas AS ci
      INNER JOIN adm_usuarios AS us ON (us.id_usr_salud=ci.id_usr_cita) 
      WHERE ci.id_cita = ?`,
      [id]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Cancelar una cita por medio de su id
 * @param  {Date} fec_cancela fecha en la que se cancela la cita
 * @param  {int} id de la cita que se desea buscar
 */
const updateCitaId = async (fec_cancela, id) => {
  try {
    return ([rows] = await pool.query(
      `UPDATE adm_citas
      SET fec_cancela = ?, id_usr_cancela=1, id_mot_cancelacion=29, estado=4
      WHERE id_cita = ?`,
      [fec_cancela, id]
    ));
  } catch (error) {
    return console.log(error);
  }
};

/**
 * Convertir turnos en citas posibles para el dia
 * @param  {string} fecha en formato string
 */
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

/**
 * Convertir turnos en citas posibles para el dia por profesional
 * @param  {int} id del profesional
 * @param  {string} fecha en formato string
 */
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

/**
 * Convierte citas disponibles y los agrupa por id_profesional
 * @param  {array} arrayRespuesta array que se desea convertir
 */
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
  getCitasInasistentesWhatsapp,
  getCitasInasistentesDocumento,
  getCitasActivasUsuario,
  getCitaId,
  insertCita,
  updateCitaId,
  compararCitas,
  compararBloqueos,
  convertirDisponibles,
};
