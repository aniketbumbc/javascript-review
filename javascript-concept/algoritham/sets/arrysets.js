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
