const fechaInicio = new Date("2020-01-01 10:00 AM");
const fechaFin = new Date("2020-01-01 02:00 PM");
const fechaValidar = new Date("2020-01-01 01:00 PM");

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

console.log(validarFechaEnRango(fechaInicio, fechaFin, fechaValidar));
