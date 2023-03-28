require("dotenv").config();
const moment = require("moment");
const {
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
  compararCitas,
  compararBloqueos,
  convertirDisponibles,
} = require("../controllers/citas.controller.js");

/**
 * Validar que fecha este en formato AAAA-MM-DD
 * @param  {string} campo
 */
function validarFormatoFecha(campo) {
  var RegExPattern = /^\d{4,4}\-\d{2,2}\-\d{2,2}$/;
  if (campo.match(RegExPattern) && campo != "") {
    return true;
  } else {
    return false;
  }
}

/**
 * Validar que la fecha no sea menor a la fecha actual
 * @param  {string} campo
 */
function validarFechaActual(campo) {
  const nFecha = new Date(campo + "T23:59");
  const hoy = new Date();
  if (nFecha >= hoy) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {string} fechaString que se quiere comparar
 * @param {int} horas que se requiere que sea mayor la fechaString a la fecha actual
 */
const validarFechaMayorAHoras = (fechaString, horas) => {
  const arrayFecha = String(fechaString).split(":");
  const [fecha, hora, minutos, amPm] = arrayFecha;
  const nFecha = new Date(fecha + " " + hora + ":" + minutos + " " + amPm);
  const ahora = new Date();
  const diferencia = (nFecha - ahora) / 1000 / 60 / 60;
  if (Math.floor(diferencia) >= horas) {
    return true;
  } else {
    return false;
  }
};

/**
 * funcion busca las citas disponibles para todos los profesionales en una fecha
 * @param {string} fecha para generar las citas disponibles y quitar las que no se pueden asignar
 */
async function getCitasDisponibles(fecha) {
  try {
    const turnosCitas = await getTurnosCitas(fecha);
    const citas = await getCitas(fecha);
    const bloqueos = await getBloqueos(fecha);

    const disponiblesCitas = await compararCitas(turnosCitas, citas[0]);

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

/**
 * funcion busca las citas disponibles para un profesional por id en una fecha
 * @param {int} id de un profesional
 * @param {string} fecha para generar las citas disponibles para un profesional y quitar las que no se pueden asignar
 */
async function getCitasDisponiblesProfesional(id, fecha) {
  try {
    const turnosCitas = await getTurnosCitasProfesional(id, fecha);
    const citas = await getCitas(fecha);
    const bloqueos = await getBloqueos(fecha);

    const disponiblesCitas = await compararCitas(turnosCitas, citas[0]);

    const disponiblesBloqueos = await compararBloqueos(
      disponiblesCitas,
      bloqueos[0]
    );

    return disponiblesBloqueos;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Funcion que retorna un texto con las citas disponibles de los profesionales en una fecha o los errores encontrados
 * @param {string} fecha para generar un mensaje con las citas disponibles de ese dia para todos los profesionales
 */
async function getMensajeDisponibles(fecha) {
  try {
    const festivos = await getFestivos(fecha);
    const res = await getCitasDisponibles(fecha);
    var mensaje = "";
    const nFecha = new Date(fecha + "T23:59");
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (!validarFormatoFecha(fecha)) {
      return "ERROR: La fecha no esta en el formato año-mes-dia (AAAA-MM-DD)";
    } else if (!validarFechaActual(fecha)) {
      return (
        "Error: El dia " +
        nFecha.toLocaleDateString("es-ES", options) +
        " Es una fecha anterior al dia de hoy, " +
        "No se pueden asignar citas para dias ya pasados"
      );
    } else if (festivos[0].length > 0) {
      return (
        "El dia " +
        nFecha.toLocaleDateString("es-ES", options) +
        " Es festivo, no hay citas disponibles para este dia"
      );
    } else if (res.length === 0) {
      return (
        "No hay citas disponibles para el dia " +
        nFecha.toLocaleDateString("es-ES", options)
      );
    } else {
      // console.log(nFecha.toLocaleDateString("es-ES", options));
      mensaje =
        "La siguiente informacion corresponde a las citas disponibles para el dia " +
        nFecha.toLocaleDateString("es-ES", options);
      for (const profesionales of res) {
        // console.log(profesionales);
        mensaje =
          mensaje +
          "\n\n" +
          "Profesional de " +
          profesionales.especialidad +
          " *" +
          profesionales.profesional +
          "*" +
          "\n" +
          "Codigo del profesional: " +
          "*" +
          profesionales.id_profesional +
          "*" +
          "\n";
        for (const cita of profesionales.disponibles) {
          // console.log(cita);
          mensaje = mensaje + "\n";
          mensaje =
            mensaje + "-> Cita disponible para el dia " + cita.fecha_string;
          mensaje = mensaje + "\n";
          mensaje = mensaje + "-----------------------------------------------";
        }
      }
      return mensaje;
    }
    // console.log(mensaje);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Asignar una cita disponible a un usuario
 * @param {string} mensaje para generar asignar una cita a un usuario en una fecha y hora para un profesional
 * @param {string} whatsapp desde donde se realiza la solicitud
 */
async function asignarCitaDisponible(mensaje, whatsapp) {
  try {
    const pattern1 = /^#asignar:./;
    const pattern2 = /[0-9]{2}/;
    const pattern3 = /AM|PM/;
    const ATEN_USUARIO = process.env.ATEN_USUARIO;
    if (mensaje.match(pattern1) && mensaje != "") {
      const array = mensaje.split(":");
      const [comodin, codigo, documento, fecha, hora, minutos, ampm] = array;
      const amPm = ampm.toUpperCase();
      const horas = 4;
      const citasInasistentes = 3;

      const pieMensaje =
        "Para solicitar una cita llamar al numero " +
        ATEN_USUARIO +
        " en horario de 09:00AM a 11:00AM del medio dia" +
        " y de 03:00PM a 04:00PM en la tarde";

      const nFecha = new Date(fecha + "T23:59");
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const usuarioDoc = await getUsuarioDocumento(documento);
      const usuarioCodigo = usuarioDoc[0][0];
      const usuarioInasistencias = await getCitasInasistentesDocumento(
        documento
      );
      const whatsappInasistencias = await getCitasInasistentesWhatsapp(
        whatsapp
      );
      // console.log(usuarioCodigo);
      const citasProfesional = await getCitasDisponiblesProfesional(
        codigo,
        fecha
      );
      const festivos = await getFestivos(fecha);
      const fechaActual = moment(new Date()).format("YYYY-MM-DD");
      const usuarioActivas = await getCitasActivasUsuario(
        fechaActual,
        documento
      );

      let buscarCitaDisponible = citasProfesional.find(
        (o) => o.fecha_string === fecha + " " + hora + ":" + minutos + amPm
      );

      if (array.length !== 7) {
        return "ERROR: Los datos suministrados no coinciden con el formato aceptado, #asignar:codigoProfesional:numeroDocumento:fechaCita:horaCita:minutosCita:AMPM";
      } else if (whatsappInasistencias[0].length >= citasInasistentes) {
        const inasistencias = whatsappInasistencias[0];
        let mensajeInasistencias =
          "Error: Este numero de whatsapp tiene " +
          citasInasistentes +
          " o mas Citas Inasistentes por lo que no puede utilizar este servicio" +
          "\n";
        for (const inasistencia of inasistencias) {
          mensajeInasistencias =
            mensajeInasistencias +
            " -> Cita: " +
            inasistencia.nombre1 +
            " " +
            inasistencia.nombre2 +
            " " +
            inasistencia.apellido1 +
            " " +
            inasistencia.apellido2 +
            ", " +
            inasistencia.fec_cita.toLocaleDateString("es-ES", options);
          mensajeInasistencias =
            mensajeInasistencias + " a las " + inasistencia.hor_cita;
          mensajeInasistencias = inasistencia.motivo_cancelacion
            ? mensajeInasistencias + ", " + inasistencia.motivo_cancelacion
            : "";

          mensajeInasistencias = mensajeInasistencias + "\n";
        }
        mensajeInasistencias = mensajeInasistencias + pieMensaje;
        return mensajeInasistencias;
      } else if (!Number.isInteger(Number(codigo))) {
        return "ERROR: El codigo del Profesional debe ser un numero Entero";
      } else if (!validarFormatoFecha(fecha)) {
        return "ERROR: La fecha no esta en el formato año-mes-dia (AAAA-MM-DD), si el mes o el dia son menores a 10 debe poner un cero adelante";
      } else if (!hora.match(pattern2) || hora.length != 2) {
        return "ERROR: La hora no esta en el formato HH, si la hora es menor que 10 debe poner un cero adelante";
      } else if (!minutos.match(pattern2) || minutos.length != 2) {
        return "ERROR: Los minutos no estan en el formato MM, si los minutos son menor que 10 debe poner un cero adelante";
      } else if (!amPm.match(pattern3) || amPm.length != 2) {
        return "ERROR: debe escribir AM si desea su cita en la mañana o PM si desea su cita en la tarde";
      } else if (!usuarioCodigo) {
        return "ERROR: usuario no encontrado en la base de datos, verifique que su numero de documento este correcto o que tenga la atencion en la institucion";
      } else if (!validarFechaActual(fecha)) {
        return (
          "Error: El dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " Es una fecha anterior al dia de hoy, " +
          "No se pueden asignar citas para dias ya pasados"
        );
      } else if (usuarioInasistencias[0].length >= citasInasistentes) {
        const inasistencias = usuarioInasistencias[0];
        let mensajeInasistencias =
          "Error: El usuario " +
          usuarioCodigo.nombre1 +
          " " +
          usuarioCodigo.nombre2 +
          " " +
          usuarioCodigo.apellido1 +
          " " +
          usuarioCodigo.apellido2 +
          " tiene " +
          citasInasistentes +
          " o mas Citas Inasistentes por lo que no puede utilizar este servicio" +
          "\n";
        for (const inasistencia of inasistencias) {
          mensajeInasistencias =
            mensajeInasistencias +
            " ->" +
            inasistencia.fec_cita.toLocaleDateString("es-ES", options);
          mensajeInasistencias =
            mensajeInasistencias + " a las " + inasistencia.hor_cita;
          mensajeInasistencias = inasistencia.motivo_cancelacion
            ? mensajeInasistencias + ", " + inasistencia.motivo_cancelacion
            : "";

          mensajeInasistencias = mensajeInasistencias + "\n";
        }
        mensajeInasistencias = mensajeInasistencias + pieMensaje;
        return mensajeInasistencias;
      } else if (usuarioActivas[0].length > 0) {
        const activas = usuarioActivas[0];
        let mensajeActivas = "";
        for (const activa of activas) {
          mensajeActivas =
            mensajeActivas + "Error: El usuario ya tiene una Cita asignada de ";
          mensajeActivas =
            mensajeActivas + activa.especialidad + " con el profesional ";
          mensajeActivas = mensajeActivas + activa.profesional;
          mensajeActivas =
            mensajeActivas +
            " para el dia " +
            activa.fec_cita.toLocaleDateString("es-ES", options);
          mensajeActivas = mensajeActivas + " a las " + activa.hor_cita;
          mensajeActivas =
            mensajeActivas +
            ", Debe cumplir con su cita para poder solicitar una nueva";
          mensajeActivas = mensajeActivas + "\n";
          mensajeActivas =
            mensajeActivas + "-----------------------------------------------";
        }
        return mensajeActivas;
      } else if (citasProfesional.length == 0) {
        return (
          "ERROR: no hay citas disponibles para el profesional con codigo " +
          codigo +
          " para el dia " +
          nFecha.toLocaleDateString("es-ES", options)
        );
      } else if (festivos[0].length > 0) {
        return (
          "Error: El dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " Es festivo, no hay citas disponibles para este dia"
        );
      } else if (!buscarCitaDisponible) {
        return (
          "Error: La cita del dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " a las " +
          hora +
          ":" +
          minutos +
          amPm +
          " con el profesional de codigo " +
          codigo +
          ", No esta disponible"
        );
      } else if (
        !validarFechaMayorAHoras(
          fecha + ":" + hora + ":" + minutos + ":" + amPm,
          horas
        )
      ) {
        return (
          "Error: no se pueden asignar citas con un tiempo menor a " +
          horas +
          " horas de la hora actual a la hora de asignacion de la cita"
        );
      }

      const registrarCita = await insertCita(
        usuarioCodigo.id_usr_salud,
        codigo,
        fecha,
        `${hora}:${minutos}${amPm}`,
        fecha,
        fecha,
        `${hora}:${minutos}${amPm}`,
        new Date(),
        whatsapp
      );

      const idCita = registrarCita[0].insertId;
      // console.log(buscarCitaDisponible);

      return (
        "Cita registrada con exito, los datos de la cita son los siguientes:\n" +
        " Codido de registro: *" +
        idCita +
        "*\n" +
        " Documento: *" +
        documento +
        "*\n" +
        " Usuario: *" +
        usuarioCodigo.nombre1 +
        " " +
        usuarioCodigo.nombre2 +
        " " +
        usuarioCodigo.apellido1 +
        " " +
        usuarioCodigo.apellido2 +
        "*\n" +
        " Fecha Cita: *" +
        nFecha.toLocaleDateString("es-ES", options) +
        " a las " +
        hora +
        ":" +
        minutos +
        amPm +
        "*\n" +
        " Especialidad: *" +
        buscarCitaDisponible.especialidad +
        "*\n" +
        " Profesional: *" +
        buscarCitaDisponible.profesional +
        "*\n" +
        "Recuerde asistir con 30 minutos de anticipacion para facturar su cita, si desea cancelar su cita Utilice el codigo de registro *" +
        idCita +
        "*, recuerde que debe cancelar con minimo " +
        horas +
        " horas de anticipacion" +
        " a la hora de la cita o se registrara como una inasistencia"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Cancelar una cita por medio de su id
 * @param {int} id de la cita que se desea cancelar
 * @param {string} whatsapp desde donde se realiza la solicitud
 */
async function cancelarCitaId(id, whatsapp) {
  try {
    const citaId = await getCitaId(id);

    return citaId;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCitasDisponibles,
  getMensajeDisponibles,
  validarFormatoFecha,
  asignarCitaDisponible,
  cancelarCitaId,
};

// getMensajeDisponibles("2023-03-16").then((res) => {
//   console.log(res);
// });

// asignarCitaDisponible(
//   "#asignar:21:1081594300:2023-03-28:12:10:pm",
//   "573043479843"
// )
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

cancelarCitaId(127909, "573043479843")
  .then((res) => {
    console.log(res[0]);
  })
  .catch((err) => {
    console.log(err);
  });
