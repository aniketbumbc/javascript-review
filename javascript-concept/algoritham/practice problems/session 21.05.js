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

console.log(sack);
