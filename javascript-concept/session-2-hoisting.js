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

console.log(studentNewRoll);
