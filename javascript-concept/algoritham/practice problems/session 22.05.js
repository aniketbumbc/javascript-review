/**
 *  Sets and Map
 */
const ids = new Set();

ids.add('Mike');
ids.add('Bunny');
ids.add(1);
ids.add(2);
ids.add(1);

console.log(ids);
console.log(ids.has(2));

ids.delete('Bunny');
console.log(ids);

const setArray = [...ids];

console.log(setArray);

const resultData = new Map();

resultData.set('avg', 12.2);

resultData.set('lastResult', null);

resultData.set('setsData', ids);

console.log(resultData);
