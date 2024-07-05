/**
 *  Check if two strings after processing backspace character are equal or not
 */

console.log('Test');

function backSpace(str1, str2) {
  let tempStr1 = removedChar(str1);
  let tempStr2 = removedChar(str2);

  if (tempStr1 === tempStr2) {
    return true;
  }

  return false;
}

function removedChar(str) {
  const alphabetsArray = Array.from(new Array(26));

  const alphaNumeric = alphabetsArray.map((e, i) =>
    String.fromCharCode(i + 97)
  );

  let tempArray = [];

  for (const char of str) {
    if (alphaNumeric.includes(char)) {
      tempArray.push(char);
    } else {
      tempArray.pop();
    }
  }

  return tempArray.join('');
}

// console.log(backSpace('geee#e#ks', 'gee##eeks'));
// console.log(backSpace('equ#ual', 'ee#quaal#'));
// console.log(backSpace('ab##kj', 'c#d#'));

const test = Array.from(new Array(30));

//console.log(test.length);

const test2 = new Array(30);

//console.log(test2.length);

//test.map((e, i) => console.log(String.fromCharCode(i + 65)));

/**
 *  Longest sub-array having sum k
 */

function longSubArry(arr, sum) {
  let maxLength = 0;

  for (let i = 0; i < arr.length; i++) {
    let tempSum = 0;

    for (let j = i; j < arr.length; j++) {
      tempSum += arr[j];

      if (sum === tempSum) {
        maxLength = Math.max(maxLength, j - i + 1);
      }
    }
  }
  return maxLength;
}

//console.log(longSubArry([10, 5, 2, 7, 1, 9], 15));
console.log(longSubArry([3, 2, 1, 5], 6));
// console.log(longSubArry([-5, 8, -14, 2, 4, 12], -5));

function minSubArray(arr, sum) {
  let result = Number.MAX_SAFE_INTEGER;
  let left = 0;
  let currentSum = 0;

  for (let i = 0; i < arr.length; i++) {
    currentSum += arr[i];
    while (currentSum >= sum) {
      result = Math.min(result, i - left + 1);
      currentSum -= arr[left];
      left++;
    }
  }

  return result;
}

console.log(minSubArray([10, 5, 2, 7, 1, 9], 15));
console.log(minSubArray([3, 2, 1, 5], 6));
