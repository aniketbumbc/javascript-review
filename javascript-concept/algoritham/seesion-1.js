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

// console.log(fib(10));

/**
 *  Prime number or not
 */

function isPrimeNumber(num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

console.log(isPrimeNumber(9));

/**
 *  Find min number into array
 */

function findMinNum(arr) {
  const minNum = Math.min(...arr);

  return minNum;
}

console.log(findMinNum([4, 6, 3, 7, 10, 9, 1]));

/**
 *  Power of two
 */

function powerOfTwo(num) {
  if (num < 1) {
    return false;
  }

  let dividedNum = num;

  while (dividedNum !== 1) {
    if (dividedNum % 2 !== 0) {
      return false;
    }

    dividedNum = dividedNum / 2;
  }
  return true;
}

console.log(powerOfTwo(16));
console.log(powerOfTwo(15));

/**
 *  Factorial
 */

function fact(num) {
  let result = 1;

  for (let i = num; i >= 1; i--) {
    console.log(i);
    result = result * i;
    console.log(result);
  }

  console.log(result);
}

fact(4);

/**
 *  Factorial with recursion
 */

function recursionFacto(num) {
  if (num === 1) {
    return 1;
  }

  return recursionFacto(num - 1) * num;
}

console.log(recursionFacto(5));
