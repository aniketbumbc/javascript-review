/**
 *  Bubble sort
 *  O(n^2)
 */

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr;
}

console.log(bubbleSort([6, 3, 2, 7, 1]));

console.log('**************');

/**
 *  Quick sort
 *  1. use pivot ele to split array into smaller chunks
 *  2. check pivot ele equal to pivot ele
 *  3. compare them unit sort array
 */

function quickSort(arr) {
  const mockArray = [...arr];

  // recursive exit condtion. No need to call again
  if (mockArray.length <= 1) {
    console.log('Insidee exit constion', mockArray);
    return mockArray;
  }

  console.log('Mockarry', mockArray);

  const smallEleArray = [];
  const biggerEleArray = [];
  // Get first element of array
  const pivotElement = mockArray.shift();

  const equalEleArray = [pivotElement];

  while (mockArray.length) {
    const currentEle = mockArray.shift();

    // check if  currentEle is equal to center ele of array
    if (currentEle === pivotElement) {
      equalEleArray.push(currentEle);
    } else if (currentEle < pivotElement) {
      smallEleArray.push(currentEle);
    } else {
      biggerEleArray.push(currentEle);
    }
  }
  // at end of while loop will get three array with small,big and center

  // then repeat process by call main function
  const smallEleSorted = quickSort(smallEleArray);
  const bigEleSorted = quickSort(biggerEleArray);

  //   return smallEleSorted.concat(equalEleArray, bigEleSorted);

  return [...smallEleSorted, ...equalEleArray, ...bigEleSorted];
}

//console.log(quickSort([6, 10, 1, 2]));

// [6]
// [1,2]
//[10]

/**
 *  Merge Sort
 *  split array multiple times and only 2 elements array left then sort those array and merge back
 */

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  console.log('First Array', arr);

  if (arr.length === 2) {
    // swap and change position
    console.log('check length 2 before', arr);
    return arr[0] > arr[1] ? [arr[1], arr[0]] : arr;
  }

  const middle = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, middle);
  const rightArr = arr.slice(middle);

  const leftSortArr = mergeSort(leftArr);
  const rightSortArr = mergeSort(rightArr);

  const mergedArr = [];
  let leftArrIndex = 0;
  let rightArrIndex = 0;

  while (
    leftArrIndex < leftSortArr.length ||
    rightArrIndex < rightSortArr.length
  ) {
    // check if condition left array becoz left array will be smaller and need to check if that not be exhausted(Finished)
    if (
      leftArrIndex >= leftSortArr.length ||
      leftSortArr[leftArrIndex] > rightSortArr[rightArrIndex]
    ) {
      mergedArr.push(rightSortArr[rightArrIndex]);
      rightArrIndex++;
    } else {
      mergedArr.push(leftSortArr[leftArrIndex]);
      leftArrIndex++;
    }
  }

  return mergedArr;
}

console.log(mergeSort([6, 10, 1, 2, 30]));
