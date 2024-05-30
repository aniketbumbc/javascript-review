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
    tempObj[char] ? (tempObj[char] += 1) : (tempObj[char] = 1);
  }

  for (const key in tempObj) {
    if (tempObj[key] > 1) {
      return { key };
    }
  }

  return {};
}

console.log(findFirstRepeatChar(word));
