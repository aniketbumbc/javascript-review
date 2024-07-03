/**
 *  Removed duplicate from array
 */

console.log('Removed duplicate array ');

const fruitsArray = ['a', 'b', 'c', 'a', 'b', 'k'];

function removedDuplicate(arry) {
  let tempArry = [];

  for (const ele of arry) {
    if (tempArry.indexOf(ele) === -1) {
      tempArry.push(ele);
    }
  }

  console.log(tempArry);
}

removedDuplicate(fruitsArray);

function removedDuplicateArr(arry) {
  const tempArry = arry.filter((ele, index) => {
    return arry.indexOf(ele) === index;
  });

  console.log(tempArry);
}

removedDuplicateArr(fruitsArray);

function removedDuplicateStr(str) {
  const strArry = str.split('');
  return strArry
    .filter((ele, index) => strArry.indexOf(ele) === index)
    .join('');
}

console.log(removedDuplicateStr('aaabbbcccdddkkk'));

/**
 *  - [ ] Find max sum subarry fixed size.K
 */

function maxCountSubArray(arry, size) {
  if (size > arry.length || arry.length === 0) {
    return -1;
  }

  let start = 0;
  let current_count = 0;
  let max_count = 0;

  // calculate size window sum
  for (let i = 0; i < size; i++) {
    current_count += arry[i];
  }

  // add next and minus previous
  for (let j = size; j < arry.length; j++) {
    current_count = current_count + arry[j] - arry[start];
    start++; // add previous counter

    if (current_count > max_count) {
      max_count = current_count;
    }
  }

  return max_count;
}

const arrayCount = [3, 2, 5, 4, 1];

// console.log('final', maxCountSubArray(arrayCount, 3));
// console.log('final', maxCountSubArray(arrayCount, 2));
// console.log('final', maxCountSubArray(arrayCount, 1));
// console.log('final', maxCountSubArray(arrayCount, 4));

/**
 * Given two strings, find if first string is a Subsequence
 *
 * **/

function subsequence(str1, str2) {
  let i = 0;
  let j = 0;

  while (i < str1.length && j < str2.length) {
    if (str1[i] === str2[j]) {
      i++;
    }
    j++;
  }

  return i === str1.length;
}

console.log(subsequence('AXY', 'ADXCPY'));

console.log(subsequence('AXY', 'YADXCP'));
console.log(subsequence('gksrek', 'geeksforgeeks'));
