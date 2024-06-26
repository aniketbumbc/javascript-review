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

console.log(reverStr('mango sweet'));

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

console.log(reverseNumber(124));

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

findMaxChar('apple banale');
