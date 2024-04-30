/**
 *  Fucntion call it self with exit condtion
 */

function factorial(n) {
  let result = 1;
  for (i = 0; i < n; i++) {
    result = result * (n - i);
  }

  console.log(result);
}

factorial(5);

/**
 *  Recursion way
 */

function factorialRec(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorialRec(n - 1);
}

console.log(factorialRec(5));
