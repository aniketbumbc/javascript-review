/**
 *  Linear search algoritham
 */

function linearSearch(arr, searchItem) {
  if (arr.length < 0) {
    return -1;
  }

  for (let [index, ele] of arr.entries()) {
    console.log(ele, index);
    if (ele === searchItem) {
      return { index: arr.indexOf(ele), ele };
    }
  }
  return -1;
}

console.log(linearSearch([5, 1, 7, 2, 0, 11, 3, 10], 3));
