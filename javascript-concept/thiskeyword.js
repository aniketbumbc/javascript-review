// 'use strict';

// console.log(this); // window object

// function callThis() {
//   console.log(this); // global main context
//   // in case of strict mode gets undifined
// }

// callThis();

/** this.age = 33;

function greet() {
  //this always refers to object which function is called on.
  console.log('I am ' + this.age + ' years');
}

// greet();

const person = {
  greetMe: greet,
};

person.greetMe();

**/

const btn = document.querySelector('button');

btn.addEventListener('click', function () {
  // function call on btn object
  // js engine define object btn
  console.log(this);
});

class Person {
  constructor() {
    this.age = 21;
  }

  greet() {
    console.log('My age', this.age);
  }

  greetWithDealy() {
    // const that = this; // in this case refer this
    //
    setTimeout(
      function () {
        // this refer only setTimeout context
        console.log(this);
        console.log('Set age', this.age);
      }.bind(this),
      1500
    );

    // take this from above
    setTimeout(() => {
      console.log(this);
      console.log('Set age', this.age);
    }, 1000);
  }
}

const max = new Person();
max.greet();
max.greetWithDealy();
