// 'use strict';

// console.log(this); // window object

// function callThis() {
//   console.log(this); // global main context
//   // in case of strict mode gets undifined
// }

// callThis();

this.age = 33;

function greet() {
  //this always refers to object which function is called on.
  console.log('I am ' + this.age + ' years');
}

// greet();

const person = {
  greetMe: greet,
};

person.greetMe();
