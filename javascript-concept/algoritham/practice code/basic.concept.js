let city = ['California', 'Barcelona', 'Paris', 'Kathmandu'];

/**
 *   Array Of Returns a new Array instance. Create new array
 */

let fruits = Array.of('Apple', 'Mango', 'Banana');

// console.log(fruits);

/***
 *  pop : -  method removes the last element from an array and returns that element.
 *  Returns undefined if the array is empty. Change the exiting array it's length
 */

let lastElement = fruits.pop();

// console.log(lastElement);
// console.log(fruits);

/***
 *  push : -  method adds zero or more elements to the end of the array.
 *  Returns  Array it's length change exiting array
 */

let pushElement = fruits.push('Lychee');

// console.log(pushElement);

// console.log(fruits);

/***
 *  shift : -  method removes the first element from an array and returns that element.
 *  Returns undefined if the array is empty.
 */

// let firstEle = fruits.shift();

// console.log(firstEle);

// console.log(fruits);

/***
 *  unshift : - method adds one or more elements to the beginning of an array
 * and returns the new length of the array.
 */

let addElement = fruits.unshift();

//console.log(addElement);

//console.log(fruits);

/***
 *  Array entries()
 * The entries() method returns a new Array
 * Iterator object containing key/value pairs for each array index.
 *
 */

// let fruitsEntries = fruits.entries();

// for (let ele of fruitsEntries) {
//   console.log(ele);
// }

/***
 *  Array every()
 * every() Return Value The every() method returns:
 * true - if all the array elements pass the given test function (callback returns a truthy value).
 * false - if any array element fails the given test function.
 */

const ageArray = [34, 23, 20, 26, 112];

const isAgeMore = ageArray.every((ele) => ele >= 20);

//console.log(isAgeMore);

/**
 *  The find() method returns the value of 
 *  the first array element that satisfies the provided test function.
 * Returns the value of the first element in the array that satisfies the given function.

 */

const isAge20 = ageArray.find((ele) => ele > 20);

console.log(isAge20);

/**
 *  The flat() method creates a new array by flattening a
 * nested array up to the specified depth.
 */

let numbers = [1, 2, [3, 4, [5, 6, [7, 8]]]];
let flattenArray = numbers.flat(Number.MAX_VALUE);

console.log(flattenArray);

/**
 *  https://www.freecodecamp.org/news/top-10-javascript-algorithms-for-coding-challenges/
 */

/**
 *  Reduce method executes a reducer function
 *  on each element of the array and returns a single output value.
 */

let totalAge = ageArray.reduce((acc, curr) => {
  return acc + curr;
});

console.log(totalAge);

/**
 *  Slice method returns a shallow copy of a portion of an array into a new array object.
 * Returns a new array containing the extracted elements.
 *
 */

let students = [2, 3, 5, 7, 11, 13, 17];

let newStudents = students.slice(1, 5);

console.log(newStudents);

/***
 *  splice The splice() method modifies an array (adds, removes or replaces elements).
 * also add element into specific index position with splice(index, 0 , item )
 * 0 means 0 delete item from array.
 *  Removed element splice(index, delete count)
 */

let pckgs = [2, 3, 5, 7, 11, 13, 17];
console.log('i', pckgs);

let spliceStudent = pckgs.splice(1, 2);

console.log(spliceStudent);

pckgs.splice(3, 0, 2000);
console.log('after', pckgs);
