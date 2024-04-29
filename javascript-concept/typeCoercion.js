/**
 *  Implicit and explict
 */

console.log('3' + 1); // Implict
console.log(Number(3) + 1); // explict

/**
 *  + add number and concatenate string
 */

function logResult(resutl) {
  console.log(resutl);
}

logResult(5 > 3);
logResult(5 > 'hi'); // convert value same value type like string or number
logResult('ani' > 'true'); // A letter before t character checking
logResult(0 == false);
logResult('true' == true);
logResult('hi' == true);

/**
 *  Or and and condtion value return
 */
logResult(true || ''); // or condtion first value true return that value
logResult(123 || '');
logResult(0 || 'fd');

logResult(true && ''); // and condtion first value true return second value
logResult(123 && 'test second value');
logResult(0 && 'fd');

/**
 *  Double bang !! operator use to force a conversion to a real boolean value
 */

logResult('Bang value');
logResult(!!2);
logResult(!!'');
logResult(!!false);
logResult(!!'test');
