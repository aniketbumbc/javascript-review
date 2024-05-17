/**
 *
 * Knapsack problem
 *  items = [{ id :'a' , val:3, w:3},
 * { id :'b' , val:6, w:8},
 * { id :'c' , val:10, w:3},]
 *
 * maxWeight = 8
 * bag = [a,c]
 */

// function knapsack(elements, maxCap) {
//   const sack = { items: [], value: 0, weight: 0 };
//   let remainCapacity = maxCap;

//   for (const ele of elements) {
//     if (ele.weight <= remainCapacity) {
//       sack.items.push(ele);
//       sack.value = sack.value + ele.value;
//       sack.weight = sack.weight + ele.weight;
//       remainCapacity = remainCapacity - ele.weight;
//     }
//   }
//   return sack;
// }

// const items = [
//   { id: 'a', value: 3, weight: 3 },
//   { id: 'b', value: 6, weight: 8 },
//   { id: 'c', value: 10, weight: 3 },
//   { id: 'd', value: 120, weight: 5 },
// ];
// const maxCap = 5;

// const resultCombination = knapsack(items, maxCap);

// console.log(resultCombination);

function knapsack(elements, capacity) {
  const sack = { items: [], value: 0, weight: 0 };
  let remainingCapacity = capacity;

  for (const el of elements) {
    if (el.weight <= remainingCapacity) {
      sack.items.push(el);
      sack.value += el.value;
      sack.weight += el.weight;
      remainingCapacity -= el.weight;
    }
  }

  return sack;
}

const items = [
  { name: 'a', value: 3, weight: 3 },
  { name: 'b', value: 6, weight: 8 },
  { name: 'c', value: 10, weight: 3 },
];
const maxCap = 5;

const sack = knapsack(items, maxCap);
console.log(sack);

// 0-1 Knapsack Problem
