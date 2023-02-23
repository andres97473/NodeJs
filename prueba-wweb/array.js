const array1 = [
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 07:30AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 02:00PM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 08:30AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 09:00AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 04:00PM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
    fecha_string: "2023-02-09 04:20PM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 24,
    profesional: "JOSE LUIS ACOSTA CISNEROS",
    fecha_string: "2023-02-09 07:30AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 24,
    profesional: "JOSE LUIS ACOSTA CISNEROS",
    fecha_string: "2023-02-09 08:30AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 24,
    profesional: "JOSE LUIS ACOSTA CISNEROS",
    fecha_string: "2023-02-09 09:00AM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 24,
    profesional: "JOSE LUIS ACOSTA CISNEROS",
    fecha_string: "2023-02-09 04:00PM",
    especialidad: "Medicina General",
  },
  {
    id_profesional: 24,
    profesional: "JOSE LUIS ACOSTA CISNEROS",
    fecha_string: "2023-02-09 04:20PM",
    especialidad: "Medicina General",
  },
];

const array2 = [
  {
    id_bloqueo: 1704,
    inicio_bloqueo: "2023-02-09 04:00PM",
    fin_bloqueo: "2023-02-09 05:00PM",
    motivo: "CAPACITACION",
    id_profesional: 21,
    profesional: "ULICES RAMIRO HERNANDEZ VELASCO",
  },
  {
    id_bloqueo: 1705,
    inicio_bloqueo: "2023-02-09 04:00PM",
    fin_bloqueo: "2023-02-09 05:00PM",
    motivo: "CAPACITACION",
    id_profesional: 23,
    profesional: "MERLYNG MARITZA MORA MEJIA",
  },
  {
    id_bloqueo: 1706,
    inicio_bloqueo: "2023-02-09 04:00PM",
    fin_bloqueo: "2023-02-09 05:00PM",
    motivo: "CAPACITACION",
    id_profesional: 112,
    profesional: "GABRIELA CRISTINA GARCIA OÑATE",
  },
  {
    id_bloqueo: 1707,
    inicio_bloqueo: "2023-02-09 04:00PM",
    fin_bloqueo: "2023-02-09 05:00PM",
    motivo: "CAPACITACION",
    id_profesional: 159,
    profesional: "ELICETH MANUELA RUANO MUESES",
  },
  {
    id_bloqueo: 1708,
    inicio_bloqueo: "2023-02-09 04:00PM",
    fin_bloqueo: "2023-02-09 05:00PM",
    motivo: "CAPACITACION",
    id_profesional: 157,
    profesional: "DIANA PATRICIA CHAVES RAMIREZ",
  },
  {
    id_bloqueo: 1710,
    inicio_bloqueo: "2023-02-09 08:00AM",
    fin_bloqueo: "2023-02-09 10:00AM",
    motivo: "REUNION POA",
    id_profesional: 159,
    profesional: "ELICETH MANUELA RUANO MUESES",
  },
];

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

console.log(compararBloqueos(array1, array2));
