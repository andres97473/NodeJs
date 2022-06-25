import { readFileSync, writeFileSync } from "fs";
import MDBReader from "mdb-reader";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ruta de carpeta exports
const ruta = path.join(__dirname, "exports");
const rutaTablas = path.join(ruta, "tablas.json");
const rutaTipoAte = path.join(ruta, "tipoAte.json");
const rutaEspecialidad = path.join(ruta, "especialidad.json");

const buffer = readFileSync("factup.mdb");
const reader = new MDBReader(buffer, "JOCAMU");

// tablas
const tablas = reader.getTableNames(); // ['Cats', 'Dogs', 'Cars']

// tipoate.getColumnNames(); // [ 'codigo', 'nombre', 'Usuario', 'Fecha_Dig' ]
// console.log(tipoate.getColumnNames());
const tipoate = reader.getTable("tipoate");
const data_tipoAte = tipoate.getData();

const especialidad = reader.getTable("especialidad");
const data_especialidad = especialidad.getData();

// exportar tablas
writeFileSync(rutaTablas, JSON.stringify(tablas), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});

// exportar tipoAte
writeFileSync(rutaTipoAte, JSON.stringify(data_tipoAte), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});

// exportar especialidad
writeFileSync(rutaEspecialidad, JSON.stringify(data_especialidad), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
