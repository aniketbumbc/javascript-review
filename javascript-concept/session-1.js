const playerName = 'Mike';

function greet() {
  const age = 22;
  console.log(playerName);
}

greet();
/**
 *  Call variable here
 */
console.log(age);

/**
 *  Local scope and global scope
 */

var studentName = 'Mike';

function greet() {
  var studentAge = 10;

  console.log('Age of student is ', studentAge);
  console.log('Name of student is ', studentName);
}

greet();
console.log(studentName);
// console.log(studentAge);

/**
 *  Block scope inside block
 */

if (true) {
  let studentNewAge = 10;
  console.log(studentNewAge);
}
//console.log(studentNewAge);
console.log(name);
