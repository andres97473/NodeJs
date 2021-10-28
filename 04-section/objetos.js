// const person = {
//     name: 'Marlun',
//     lastname: 'Espiritusanto',
//     isStudent: true,
//     getFullName() {
//         return this.name + " " + this.lastname
//     }
// };

// dot notation
//console.log(person.name);

// braket notation
//console.log(person["name"]);

// funcion dentro del objeto
// console.log(person.getFullName());


class Person {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

// el parentesis de la clase hace referencia al constructor de la clase Person
const person = new Person("Marluan");
let name = person.getName();

console.log(name);