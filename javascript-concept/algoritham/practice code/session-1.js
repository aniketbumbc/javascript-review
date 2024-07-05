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
