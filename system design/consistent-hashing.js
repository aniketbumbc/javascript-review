const crypto = require('crypto');
const hash = (s) =>
  crypto.createHash('sha256').update(s).digest().readUInt32BE(0);

const users = [
  { name: 'Aniket', age: 30 },
  { name: 'Riya', age: 25 },
  { name: 'Karan', age: 28 },
  { name: 'Meera', age: 35 },
  { name: 'Arjun', age: 22 },
  { name: 'Sneha', age: 31 },
  { name: 'Rohan', age: 27 },
  { name: 'Priya', age: 29 },
];

let ring = []; // [{ pos, node }] ordered by pos

function addNode(node, pos = hash(node)) {
  ring.push({ pos, node });
  ring.sort((a, b) => a.pos - b.pos);
}

function getNode(key, h = hash(key)) {
  for (let i = 0; i < ring.length; i++) {
    if (ring[i].pos > h) return ring[i].node; // first position greater than the hash
  }
  return ring[0].node; // wrap around the ring
}

const owner = (user) => getNode(user.name);

function removeNode(node) {
  ring = ring.filter((r) => r.node !== node);
}

// ---------- Virtual nodes: each server gets many positions on the ring ----------
// Without them, 3 servers = 3 points, and load is very uneven.
const VNODES = 100;
const addServer = (node) => {
  for (let i = 0; i < VNODES; i++) addNode(node, hash(`${node}#${i}`));
};

// ---------- Demo ----------
const snapshot = () => Object.fromEntries(users.map((u) => [u.name, owner(u)]));

function printMapping(title) {
  console.log(`\n=== ${title} ===`);
  const counts = {};
  for (const u of users) {
    const n = owner(u);
    counts[n] = (counts[n] || 0) + 1;
    console.log(`${u.name.padEnd(8)} (hash ${String(hash(u.name)).padStart(10)}) -> ${n}`);
  }
  console.log('Load per server:', counts);
}

function printMoved(before, after) {
  const moved = Object.keys(before).filter((k) => before[k] !== after[k]);
  console.log(
    `Moved ${moved.length}/${users.length} keys:`,
    moved.map((k) => `${k}: ${before[k]} -> ${after[k]}`)
  );
}

// ---------- Lookup: which server holds a given user? ----------
function findServer(name) {
  const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
  const server = getNode(user ? user.name : name);
  if (user) {
    console.log(`User "${user.name}" (age ${user.age}) is stored on -> ${server}`);
  } else {
    console.log(`User "${name}" not found in users list; it would be stored on -> ${server}`);
  }
  return server;
}

['server-A', 'server-B', 'server-C'].forEach(addServer);

const inputName = process.argv[2];
if (inputName) {
  // Usage: node consistent-hashing.js Aniket
  findServer(inputName);
} else {
  printMapping('3 servers');

  let before = snapshot();
  addServer('server-D');
  printMapping('After adding server-D');
  printMoved(before, snapshot());

  before = snapshot();
  removeNode('server-B');
  printMapping('After removing server-B');
  printMoved(before, snapshot());
}
