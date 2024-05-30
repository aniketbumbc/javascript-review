/**
 *  Hash table  can follow index and value.
 *  if object has key and value. Key entry point to store as index.
 *  Process key as index using hashing to store as index
 */

/**
 *  Find first repeating character
 */

const word = 'niketn';

function findFirstRepeatChar(str) {
  const tempObj = {};
  for (let char of str) {
    if (tempObj[char]) {
      return char;
    }
    tempObj[char] = 1;
  }
}

console.log(findFirstRepeatChar(word));
