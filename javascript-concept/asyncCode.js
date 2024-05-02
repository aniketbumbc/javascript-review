const btn = document.querySelector('button');

// btn.addEventListener('click', callingBtn);

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

function callingBtn() {
  console.log('click me');
}

/**
 *
 *  Promise setup by step manage callback function is hard to understand and manage.
 *  So we use callback
 *  1. it java sctipt object with certain operation.
 *  2. promise eventully finished or settled
 * 3. then method exectute when promise settled
 * 4. to avoid call back hell
 *  there 3 state
 * 1. pending  ( it is initial state Promise not produce result yet)
 * 2.Fatullfiled  once is compelte state  promise resloved
 * 3. Rejected state ( data failed to get) promise rejected
 * onces promise relsove then function gets execute
 */

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Yes it's woking ");
  }, 2000);
});

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then((res) => res.json())
  .then((data) => console.log(data));

function callPromise() {
  myPromise
    .then((data) => {
      console.log(data);
    })
    .then(() => {
      console.log('second then method');
    })
    .then(() => {
      setTimeout(() => {
        console.log('this is next thrid then');
      }, 5000);
    });
}

btn.addEventListener('click', callPromise);
