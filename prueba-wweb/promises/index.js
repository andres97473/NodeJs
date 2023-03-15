const {
  getTurnosCitas,
  getCitas,
  getBloqueos,
  getFestivos,
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

async function getMensajeDisponibles(fecha) {
  try {
    const festivos = await getFestivos(fecha);
    const res = await getCitasDisponibles(fecha);
    const nFecha = new Date(fecha + "T23:59");
    var mensaje = "";
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

async function asignarCitaDisponible(mensaje) {
  try {
    const pattern1 = /^#asignar:./;
    const numero = /\d{2}/;
    if (mensaje.match(pattern1) && mensaje != "") {
      const array = mensaje.split(":");
      if (array.length !== 6) {
        return "ERROR: Faltan datos para poder realizar la solicitud, revisa el formato aceptado";
      } else {
        const [comodin, codigo, fecha, hora, minutos, amPm] = array;
        console.log(comodin, codigo, fecha, hora, minutos, amPm);
        // TODO: validar cada campo antes de buscar en db
        if (!Number.isInteger(Number(codigo))) {
          console.log(codigo);
          return "ERROR: El codigo del Profesional debe ser un numero Entero";
        } else if (!validarFormatoFecha(fecha)) {
          return "ERROR: La fecha no esta en el formato año-mes-dia (AAAA-MM-DD)";
        } else if (!hora.match(numero)) {
          return "ERROR: La hora no esta en el formato HH, si la hora es menor que 10 debe poner un cero adelante";
        } else if (!minutos.match(numero)) {
          return "ERROR: Los minutos no estan en el formato MM, si los minutos son menor que 10 debe poner un cero adelante";
        }
        // TODO: revisar if
        else if (amPm != "AM") {
          if (amPm != "PM") {
            return "ERROR: debe escribir AM si desea su cita en la mañana o PM si desea su cita en la tarde";
          }
        }

        return "correcto";
      }
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

asignarCitaDisponible("#asignar:21:2023-03-16:09:30:PM")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// getMensajeDisponibles("2023-03-16").then((res) => {
//   console.log(res);
// });
