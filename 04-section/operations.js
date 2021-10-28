const age = 10;
const calificacion = 80;

const operation = "subs";
let n1 = 80;
let n2 = 60;


// condiciones con if y else
/* if (calificacion >= 90) {
    console.log('A');
} else if (calificacion >= 80 && calificacion < 90) {
    console.log('B');
} else if (calificacion >= 70 && calificacion < 80) {
    console.log('C');
} else {
    console.log('REPROBADO');
} */


switch (operation) {
    case "add":
        console.log(n1 + n2);
        break;
    case "subs":
        console.log(n1 - n2);
        break;
    default:
        console.log("Operacion no valida")
        break;
}