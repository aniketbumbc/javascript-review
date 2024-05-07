function createGreet() {
  const myName = 'Max-Mine';

  return function () {
    console.log(myName);
  };
}

const greet = createGreet(); // result return function not value

greet();

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

/**
 * 1.  every time new anonmys fuction creates with log surrounding context
 * 2. with env global variable name log in name and acces 5 time
 * 3. dont log value
 * 4. after for loop finished value look which variable i ie 5
 * 5.
 */

for (var i = 0; i < 5; i++) {
  (function () {
    var j = i;
    setTimeout(() => {
      console.log(j);
    }, 1000);
  })();
}
