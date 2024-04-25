greet();

console.log(studentName);

var studentName = 'Bunny';

function greet() {
  console.log('Welcome to greet');
}

/**
 *  Case: 1 variable has value assingn then variable has higher piority
 */
var studentRoll = 1000;

function studentRoll() {
  console.log('Calling function variable');
}

console.log(studentRoll);

/**
 *  Case: 2 variable has no value assingn then function has higher piority
 */
var studentNewRoll;

function studentNewRoll() {
  console.log('Calling function variable');
}

// console.log(studentNewRoll);

/**
 *  Loops in java script
 * for
 * for of
 * for in
 * forEach()
 * while
 */

const arrayTest = [9, 6, 4, 6, 7, 20, 45, 32, 11, 100];

// for (let i = 0; i < arrayTest.length; i++) {
//   console.log(arrayTest[i]);
// }

// for (let ele of arrayTest) {
//   console.log(ele);
// }

const student = {
  age: 12,
  name: 'mike',
  company: 'google',
  city: 'London',
};

for (const key in student) {
  console.log(key, '+ : + ', student[key]);
  console.log();
}

for (const value of Object.values(student)) {
  console.log(value);
}
