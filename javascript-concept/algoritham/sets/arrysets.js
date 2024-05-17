/**
 *  Cartesian of product
 */

function cartProduct(arrColor, arrSize) {
  const finalResult = [];
  for (let i = 0; i < arrColor.length; i++) {
    for (let j = 0; j < arrSize.length; j++) {
      finalResult.push([arrColor[i] + ' ' + arrSize[j]]);
    }
  }

  console.log(finalResult);
}

const arrColor = ['red', 'green', 'Yellow', 'Pink'];
const arrSize = ['M'];

cartProduct(arrColor, arrSize);

/**
 *
 * 1. verify input data and problem
 * 2. think and talk with problem solution
 * 3. write down pseudo code first version down.
 * 4. drive time complexity
 * 5. split problem into chunks ie sub  problems.
 * 6. use console or break points
 * 7. use helper variable for intermediate result.
 */
