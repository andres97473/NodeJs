const {
  getTurnosCitas,
  getTurnosCitasProfesional,
  getCitas,
  getBloqueos,
  getFestivos,
  getUsuarioDocumento,
  getCitasInasistentesDocumento,
  compararCitas,
  compararBloqueos,
  convertirDisponibles,
} = require("../controllers/citas.controller.js");
const moment = require("moment");

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
 * @param fechaString que se quiere comparar
 * @param horas que se reuqiere que sea mayor la fechaString a la fecha actual
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
 * @param fechaString para generar las citas disponibles y quitar las que no se pueden asignar
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
 * @param fechaString para generar las citas disponibles para un profesional y quitar las que no se pueden asignar
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
 * @param fechaString para generar un mensaje con las citas disponibles de ese dia para todos los profesionales
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
 * @param mensaje para generar asignar una cita a un usuario en una fecha y hora para un profesional
 */
async function asignarCitaDisponible(mensaje) {
  try {
    const pattern1 = /^#asignar:./;
    const pattern2 = /\d{2}/;
    const pattern3 = /AM|PM/;
    if (mensaje.match(pattern1) && mensaje != "") {
      const array = mensaje.split(":");
      const [comodin, codigo, documento, fecha, hora, minutos, amPm] = array;
      const horas = 4;

      const nFecha = new Date(fecha + "T23:59");
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const usuarioDoc = await getUsuarioDocumento(documento);
      const usuarioCodigo = usuarioDoc[0][0];
      // console.log(usuarioCodigo);
      const citasProfesional = await getCitasDisponiblesProfesional(
        codigo,
        fecha
      );
      const festivos = await getFestivos(fecha);

      let buscarCitaDisponible = citasProfesional.find(
        (o) => o.fecha_string === fecha + " " + hora + ":" + minutos + amPm
      );

      if (array.length !== 7) {
        return "ERROR: Los datos suministrados no coinciden con el formato aceptado, #asignar:codigoProfesional:numeroDocumento:fechaCita:horaCita:minutosCita:AMPM";
      } else if (!Number.isInteger(Number(codigo))) {
        return "ERROR: El codigo del Profesional debe ser un numero Entero";
      } else if (!validarFormatoFecha(fecha)) {
        return "ERROR: La fecha no esta en el formato año-mes-dia (AAAA-MM-DD), si el mes o el dia son menores a 10 debe poner un cero adelante";
      } else if (!hora.match(pattern2)) {
        return "ERROR: La hora no esta en el formato HH, si la hora es menor que 10 debe poner un cero adelante";
      } else if (!minutos.match(pattern2)) {
        return "ERROR: Los minutos no estan en el formato MM, si los minutos son menor que 10 debe poner un cero adelante";
      } else if (!amPm.match(pattern3) || amPm.length != 2) {
        return "ERROR: debe escribir AM si desea su cita en la mañana o PM si desea su cita en la tarde";
      } else if (usuarioDoc[0].length == 0) {
        return "ERROR: usuario no encontrado en la base de datos";
      } else if (!validarFechaActual(fecha)) {
        return (
          "Error: El dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " Es una fecha anterior al dia de hoy, " +
          "No se pueden asignar citas para dias ya pasados"
        );
      } else if (citasProfesional.length == 0) {
        return (
          "ERROR: no hay citas disponibles para el profesional con codigo " +
          codigo +
          " para el dia " +
          nFecha.toLocaleDateString("es-ES", options)
        );
      } else if (festivos[0].length > 0) {
        return (
          "El dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " Es festivo, no hay citas disponibles para este dia"
        );
      } else if (!buscarCitaDisponible) {
        return (
          "La cita del dia " +
          nFecha.toLocaleDateString("es-ES", options) +
          " a las " +
          hora +
          ":" +
          minutos +
          amPm +
          ", para el profesional con codigo " +
          codigo +
          " No esta disponible"
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

      // TODO: validar usuario con citas activas, validar usuario con inasistencias

      // TODO: insertar cita en base de datos
      return buscarCitaDisponible;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCitasDisponibles,
  getMensajeDisponibles,
  validarFormatoFecha,
  asignarCitaDisponible,
};

asignarCitaDisponible("#asignar:21:1081594300:2023-03-17:03:00:PM")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// getMensajeDisponibles("2023-03-16").then((res) => {
//   console.log(res);
// });
