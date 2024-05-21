/** One item at time try to make best decision at time.
 *
 * @param {*} ele
 * @param {*} cap
 */

function knapsackGreedy(ele, cap) {
  const sack = { items: [], value: 0, weight: 0 };
  let remainCapacity = cap;

  for (const item of ele) {
    if (item.weight <= remainCapacity) {
      sack.items.push(item);
      sack.value += item.value;
      sack.weight += item.weight;
      remainCapacity -= item.weight;
    }
  }

  return sack;
}

const items = [
  { name: 'a', value: 3, weight: 8 },
  { name: 'c', value: 10, weight: 3 },

  { name: 'b', value: 20, weight: 4 },
];
const maxCap = 8;

const sack = knapsackGreedy(items, maxCap);

// console.log(sack);

/**
 *
 *  coin problem
 */

const coins = [8, 6, 5, 1];
const target = 63;

function calculateValue(coins, value) {
  //
  const calculateCoins = {};
  let remainingTarget = value;
  let calculateTotalCoins = 0;

  for (let ele of coins) {
    calculateCoins[ele] = 0;
    while (ele <= remainingTarget) {
      calculateCoins[ele]
        ? (calculateCoins[ele] += 1)
        : (calculateCoins[ele] = 1);

      remainingTarget -= ele;
    }
  }

  for (key in calculateCoins) {
    calculateTotalCoins += calculateCoins[key];
  }

  return { calculateCoins, calculateTotalCoins };
}

// const result = calculateValue(coins, target);

// console.log(result);

/**
 *  Another approach  all possible solution
 */

function computeBruteForce(coins, target) {
  const results = [];
  for (let i = 0; i < coins.length; i++) {
    results.push(calculateValue(coins.slice(i), target));
  }

  let smallAmountCoins = Number.MAX_SAFE_INTEGER;
  let finalResult;
  for (let ele of results) {
    if (ele.calculateTotalCoins < smallAmountCoins) {
      smallAmountCoins = ele.calculateTotalCoins;
      finalResult = ele;
    }
  }
  return finalResult;
}

console.log(computeBruteForce(coins, target));
