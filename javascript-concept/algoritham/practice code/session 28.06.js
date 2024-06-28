console.log('testing');

/**
 *  Find max and min number in array
 *
 */

/**
 *  Prime Number
 */

/**
 * Given a string s, find the first non-repeating character in it and return its index.
 */

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

console.log(convertFlattenArray(nonFlatArray));

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

  console.log(Object.values(tempObj));
}

// groupOfAnagram(inputArray);
