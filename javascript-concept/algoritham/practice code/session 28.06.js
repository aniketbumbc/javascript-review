/**
 *  Find max and min number in array
 *
 */

function findMaxNMin(arry) {
  let max = Number.NEGATIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;

  for (let ele of arry) {
    if (ele > max) {
      max = ele;
    }

    if (ele < min) {
      min = ele;
    }
  }

  console.log(max, min);
}

console.log(findMaxNMin([8, 6, 5, 4, 10, 11, 102, 100, -1]));

/**
 *  Prime Number  and print prime number 10 to 100
 *
 */

function isPrimeNumber(number) {
  if (number <= 0) {
    return false;
  }

  if (number === 1 && number === 2) {
    return true;
  }

  for (let i = 2; i < number; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

function printPrimeNumber(num) {
  for (let i = 0; i < num; i++) {
    if (isPrimeNumber(i)) {
      console.log(i);
    }
  }
}

printPrimeNumber(20);

/**
 * Given a string s, find the first non-repeating character in it and return its index.
 */

function nonRepeatingChar(str) {
  const tempObj = {};

  for (const char of str) {
    tempObj[char] ? (tempObj[char] += 1) : (tempObj[char] = 1);
  }

  console.log(tempObj);

  for (const key in tempObj) {
    if (tempObj[key] === 1) {
      const indexItem = str.indexOf(key);
      return { key, indexItem };
    }
  }
}

//console.log(nonRepeatingChar('aniketaelt'));

/**
 *  Flatten array
 *
 */

const nonFlatArray = [1, [2, [3, [4, 5], 6], 7, 8], 9, 10];

function convertFlattenArray(array) {
  const tempArray = [];

  for (let ele of array) {
    if (Array.isArray(ele)) {
      tempArray.push(...convertFlattenArray(ele));
    } else {
      tempArray.push(ele);
    }
  }

  return tempArray;
}

//console.log(convertFlattenArray(nonFlatArray));

/**
 *  removed duplicate from string
 */

/**
 *  Group of anagram
 */

const inputArray = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

function groupOfAnagram(array) {
  const tempObj = {};

  /**
   *  Sort word by abc order
   */

  for (let ele of array) {
    const sortWord = ele.split('').sort().join('');

    /**
     *  check in the object if key ie sort word present or not
     * if not then add as array
     */

    if (tempObj[sortWord]) {
      tempObj[sortWord].push(ele);
    } else {
      tempObj[sortWord] = [ele];
    }
  }

  // console.log(Object.values(tempObj));
}

// groupOfAnagram(inputArray);
