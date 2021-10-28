// arreglo
const fruits = [
    "apple",
    "melon",
    "mango",
    function() {
        console.log("Hola");
    },
];

// hacer llamado a un elelemnto de la lista por su posicion
// console.log(fruits[0]);

// hacer el llamado a una funcion dentro de un arreglo
// console.log(fruits[3]());

// sets, los sets no permiten agregar valores repetidos
// const numbers = new Set();
// numbers.add(5);
// numbers.add(5);
// numbers.add(4);

// console.log(numbers);

// map es parecido al set pero nos permite agregar una clave valor a los datos.
const students = new Map();
students.set("one", "Marluan");

console.log(students.get("one"));