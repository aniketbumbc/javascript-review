/**
 *   Reverse string
 */

function reverseString(str) {
  let reverseStr = '';

  for (let char of str) {
    reverseStr = char + reverseStr;
  }

  return reverseStr;
}

console.log(reverseString('hello aniket'));

/**
 *  second method
 */

function reverStr(str) {
  const charArray = Array.from(str).reverse().join('');

  return charArray;
}

// console.log(reverStr('mango sweet'));

/**
 *  reverse number
 */

function reverseNumber(number) {
  let remainder = 0;
  let temp = 0;

  while (number > 0) {
    remainder = number % 10;
    temp = temp * 10 + remainder;

    number = Math.floor(number / 10);
  }

  return temp;
}

// console.log(reverseNumber(124));

/**
 *  Find out max char in string and char
 */

function findMaxChar(str) {
  const tempObj = {};

  for (let char of str) {
    tempObj[char] ? (tempObj[char] += 1) : (tempObj[char] = 1);
  }

  let count = 0;
  let char = '';

  for (const key in tempObj) {
    if (tempObj[key] > count) {
      count = tempObj[key];
      char = key;
    }
  }

  console.log(count, char);
}

// findMaxChar('apple banale');

/**
 * Then Proxy It helps you create another object on behalf of the original object.
 * This new proxy object will act as a mediator between the real world and the original object.
 * In this way, we will have more control over the interaction with the original object.
 * https://www.javascripttutorial.net/javascript-proxy/
 */

const books = {
  Deep: 'Cal Newport',
  Atomic: 'James Clear',
};

const handler = {
  get(target, property) {
    console.log(`Property ${property} has been read.`);
    return target[property];
  },
};

const proxyUser = new Proxy(books, handler);

// console.log(proxyUser.Deep);
// console.log(proxyUser.Atomic);

/**
 *  Sort array without sort function
 */

function sortArray(arr) {
  for (let i = 0; i <= arr.length; i++) {
    for (let j = i + 1; j <= arr.length; j++) {
      if (arr[i] > arr[j]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr;
}

console.log(sortArray([8, 7, 6, 5, 4, 3, 2, 1]));

/**
 *
 *  Sort array without sort function bubble sort method
 */

function bubbleSort(arr) {
  done = false;

  while (!done) {
    done = true;
    for (let k = 1; k < arr.length; k++) {
      if (arr[k - 1] > arr[k]) {
        done = false;
        let temp = arr[k - 1];
        arr[k - 1] = arr[k];
        arr[k] = temp;
      }
    }
  }

  console.log(arr);
}

bubbleSort([8, 7, 6, 5, 4, 3, 2, 1]);
bubbleSort(['f', 'b', 's', 'k', 'l', 'o']);
