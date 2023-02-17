const { getEmployees } = require("./controllers/employees.controller.js");
const {
  getTurnos,
  getTurnosCitas,
} = require("./controllers/citas.controller.js");

// getEmployees()
//   .then((employees) => {
//     var mensaje = "";
//     empleados = [];
//     empleados = employees[0];
//     // console.log(empleados);
//     for (const i of empleados) {
//       // TODO: concatenar string
//       mensaje =
//         mensaje +
//         "Su nombre es " +
//         i.name +
//         ", y su salario es: " +
//         i.salary +
//         "\n";
//     }
//     console.log(mensaje);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

getTurnosCitas()
  .then((citas) => {
    console.log(citas);
  })
  .catch((err) => {
    console.log(err);
  });
