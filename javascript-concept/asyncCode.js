setTimeout(() => {
  console.log('timer complete');
}, 2000);

console.log('before time complete');

/**
 * Call back in java script async operations
 * function pass as agrument to another function that function call callback function
 */

function greet(name, age, cb) {
  console.log('My name is ', name);
  cb(age);
}

function greetMeet(age) {
  console.log('I m callback', age);
}

greet('Bunny', 10, greetMeet);
