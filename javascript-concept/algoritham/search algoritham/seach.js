/**
 *  Linear search algoritham
 */

function linearSearch(arr, searchItem) {
  if (arr.length < 0) {
    return -1;
  }

  for (let [index, ele] of arr.entries()) {
    //console.log(ele, index);
    if (ele === searchItem) {
      return { index, ele };
    }
  }
  return -1;
}

console.log(linearSearch([5, 1, 7, 2, 0, 11, 3, 10], 3));

/**
 *  Binary search algoritham
 *  only work ordered list
 * 1. find median
 * 2. serch Item compare with median
 * 3. Then check half of list
 *
 */

const testArry = [5, 6, 7, 8, 9, 10, 11, 12, 13];

function binarySearchEle(arr, eleItem) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    //find middle element and search one side of array
    let middle = start + Math.floor((end - start) / 2);
    if (eleItem === arr[middle]) {
      return middle;
    }

    if (arr[middle] < eleItem) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
  return -1;
}

console.log(binarySearchEle(testArry, 111));
