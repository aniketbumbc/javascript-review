/**
 *  Calculate  sum of input array
 */

function calculateSum(arr) {
  let sum = 0;
  for (let ele of arr) {
    sum = sum + ele;
  }
  return sum;

  //const result = arr.reduce((acc, curr) => acc + curr);

  //console.log(result);
}

console.log(calculateSum([1, 2, 4, 5, 6, 100, 22]));
