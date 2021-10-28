const fruits = ["apple", "melon", "lemon", "mango"];

const people = [{ name: "Marluan" }, { name: "Ernesto" }];

// console.log(fruits[0]);
// console.log(fruits[1]);
// console.log(fruits[2]);

// ciclo for convencional
// for (let i = 0; i <= fruits.length; i++) {
//     console.log(fruits[i]);
// }

// ciclo for of
// for (const fruit of fruits) {
//     console.log(fruit);
// }

// ciclo for of
// for (person of people) {
//     console.log(person.name);
// }

// ciclo while

let iterator = 0;
while (iterator < people.length) {
    console.log(people[iterator]);
    iterator++;
}