const hobbies = ['playing', 'singing', 'reading', 'art'];
const todos = ['playing', 'singing', 'reading'];

/**
 *  We are comparing pointers so getting value as false
 */
console.log(hobbies === todos);
console.log(hobbies == todos);

/**
 *  Copy reference value
 */

/*
 True copy of array using slice
 */

const newTodos = hobbies.slice(); // create new copy
const spreadTodos = [...hobbies]; // create new copy

console.log(newTodos);

/**
 *  New copy object with no deep clone
 */

const stundet = { age: 12, name: 'mike' };
const assignStudnet = { ...stundet }; // Take new copy of object

const user = Object.assign({}, stundet);

/**
 *  New copy array with with deep clone
 */

const rsStudents = [
  { age: 12, name: 'mike' },
  { age: 12, name: 'john' },
];

const deepCloneStudents = rsStudents.map((user) => {
  return { ...user };
});

deepCloneStudents[0].name = 'buuny';

console.log(deepCloneStudents);
console.log(rsStudents);
