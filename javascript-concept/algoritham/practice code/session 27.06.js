/**
 *  Find second large element in array
 */

function findSecondLargeEle(arr) {
  const largeEle = Math.max(...arr);
  const indexOfLargeEle = arr.indexOf(largeEle);
  arr.splice(indexOfLargeEle, 1);

  console.log(Math.max(...arr));
}

findSecondLargeEle([90, 12, 33, 100, 34, 99]);

/**
 *  Count Vowels in string
 */

function countVowels(str) {
  let count = 0;
  const vowelsArry = ['a', 'e', 'i', 'o', 'u'];

  for (let char of str) {
    if (vowelsArry.includes(char)) {
      count++;
    }
  }

  console.log(count);
}

countVowels('pseudopseudohypoparathyroidism');

/**
 *  Check anagram or not
 * same character and order change
 */

function isAnagramWords(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }

  const objStr1 = count(str1);
  const objStr2 = count(str2);

  for (let key in objStr1) {
    if (objStr1[key] !== objStr2[key]) {
      return false;
    }
  }

  return true;
}

function count(str) {
  const temp = {};

  for (let char of str) {
    temp[char] ? (temp[char] += 1) : (temp[char] = 1);
  }

  return temp;
}

// console.log(isAnagramWords('listen', 'silent'));
console.log(isAnagramWords('arc', 'car'));
// console.log(isAnagramWords('listel', 'silent'));
