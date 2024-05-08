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

// console.log(calculateSum([1, 2, 4, 5, 6, 100, 22]));

/**
 *  Maths algoritham fibonacci series
 */

function fibo(num) {
  let result = 0;

  for (let i = 1; i <= num; i++) {
    console.log(i, 'result', result);
    result = result + i;
  }

  return result;
}

// console.log(fibo(10));

function fib(num) {
  const nums = [1, 1];

  for (let i = 2; i <= num; i++) {
    console.log('nums');
    nums.push(nums[i - 2] + nums[i - 1]);
  }

  return nums[num - 1];
}

console.log(fib(10));

/**
 *  Prime number
 */
