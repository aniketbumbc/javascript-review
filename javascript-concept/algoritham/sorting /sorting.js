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
 *  1. use pivot ele to split array into smaller chuncks
 *  2. check pivot ele equal to pivot ele
 *  3. comapare them unit sort array
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

  const equallEleArray = [pivotElement];

  while (mockArray.length) {
    const currentEle = mockArray.shift();

    // check if  currentEle is equal to center ele of array
    if (currentEle === pivotElement) {
      equallEleArray.push(currentEle);
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

  //   return smallEleSorted.concat(equallEleArray, bigEleSorted);

  return [...smallEleSorted, ...equallEleArray, ...bigEleSorted];
}

console.log(quickSort([6, 10, 1, 2]));

// [6]
// [1,2]
//[10]

/**
 *  Merge Sort
 */
