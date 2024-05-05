/**
 *
 *  Constructor and function
 */

function Employee(name, id) {
  this.name = name;
  this.id = id;
}

const emp1 = new Employee('Andy', 232);
const emp2 = new Employee('Andy-1', 032);

console.log(emp1);

const newObj = new Object();
console.log(newObj);

/**
 *  Constructor using class
 */

class Student {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log('Welcome from greet');
  }
}

const s1 = new Student('Bunny', 343);

console.log(s1);
s1.greet();
