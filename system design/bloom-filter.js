/*
  BLOOM FILTER
  ============

  What is it?
  A Bloom filter is a space-efficient, probabilistic data structure that answers:
    "Is this item in the set?"
  with one of two answers:
    - "Definitely NOT in the set"  (100% correct)
    - "PROBABLY in the set"        (may be wrong -> false positive)

  It never gives a false negative. If it says "no", the item was never added.

  How it works:
  1. Keep a bit array of size m, all bits start at 0.
  2. Use k different hash functions.
  3. add(item):  hash the item k times, set those k bit positions to 1.
  4. has(item):  hash the item k times, check those k positions.
       - If ANY bit is 0  -> definitely not present.
       - If ALL bits are 1 -> probably present (bits may have been set by other items).

  Example (m = 10, k = 3):
    add("cat")  -> positions 1, 4, 7   bits: 0 1 0 0 1 0 0 1 0 0
    add("dog")  -> positions 2, 4, 9   bits: 0 1 1 0 1 0 0 1 0 1
    has("cow")  -> positions 1, 3, 7   bit 3 is 0 -> definitely NOT present
    has("fox")  -> positions 1, 2, 9   all 1     -> "probably" present (false positive!)

  Choosing size (n = expected items, p = acceptable false positive rate):
    m = -(n * ln p) / (ln 2)^2      -> number of bits
    k = (m / n) * ln 2              -> number of hash functions
    e.g. n = 1,000,000 items, p = 1%  -> m ≈ 9.6M bits (~1.2 MB), k ≈ 7
    (storing 1M URLs as strings would take ~50+ MB)

  Pros:
    - Very little memory, O(k) add and lookup.
  Cons:
    - False positives are possible.
    - Can't delete items (clearing a bit could remove other items).
      Use a "Counting Bloom Filter" if you need deletes.
    - Can't list the items it stores.

  Real-world uses:
    - Databases (Cassandra, HBase, RocksDB, Bigtable): skip a disk read when a key surely isn't in an SSTable.
    - URL shortener: check quickly whether a short code is already taken before hitting the DB.
    - Web crawlers: skip URLs that were already visited.
    - Chrome (in the past): checked URLs against a list of malicious sites.
    - Medium: avoid recommending articles a user has already read.
    - CDNs (Akamai): cache only "one-hit wonders" on their second request.
*/

const crypto = require('crypto');

class BloomFilter {
  constructor(expectedItems, falsePositiveRate = 0.01) {
    // optimal number of bits and hash functions
    this.size = Math.ceil(
      -(expectedItems * Math.log(falsePositiveRate)) / Math.LN2 ** 2
    );
    this.hashCount = Math.max(
      1,
      Math.round((this.size / expectedItems) * Math.LN2)
    );
    // Uint8Array: 8 bits per byte, so we need size/8 bytes
    this.bits = new Uint8Array(Math.ceil(this.size / 8));
  }

  // Double hashing: index_i = (h1 + i * h2) % m
  // Gives k hashes from just 2 real hashes (Kirsch–Mitzenmacher technique).
  _positions(item) {
    const hash = crypto.createHash('md5').update(String(item)).digest();
    const h1 = hash.readUInt32BE(0);
    const h2 = hash.readUInt32BE(4) || 1; // avoid h2 = 0
    const positions = [];
    for (let i = 0; i < this.hashCount; i++) {
      positions.push((h1 + i * h2) % this.size);
    }
    return positions;
  }

  _setBit(pos) {
    this.bits[Math.floor(pos / 8)] |= 1 << pos % 8;
  }

  _getBit(pos) {
    return (this.bits[Math.floor(pos / 8)] & (1 << pos % 8)) !== 0;
  }

  add(item) {
    for (const pos of this._positions(item)) this._setBit(pos);
  }

  has(item) {
    return this._positions(item).every((pos) => this._getBit(pos));
  }
}

// ---------- Demo ----------
const filter = new BloomFilter(1000, 0.01);
console.log(`bits: ${filter.size}, hash functions: ${filter.hashCount}`);
// bits: 9586, hash functions: 7

filter.add('apple');
filter.add('banana');
filter.add('https://example.com');

console.log(filter.has('apple')); // true  (probably present)
console.log(filter.has('banana')); // true  (probably present)
console.log(filter.has('mango')); // false (definitely not present)

// ---------- Measure false positive rate ----------
const bf = new BloomFilter(1000, 0.01);
for (let i = 0; i < 1000; i++) bf.add(`user-${i}`);

let falsePositives = 0;
const tests = 10000;
for (let i = 0; i < tests; i++) {
  if (bf.has(`other-${i}`)) falsePositives++; // none of these were added
}
console.log(
  `false positive rate: ${((falsePositives / tests) * 100).toFixed(2)}%`
); // ~1%

// ---------- Use case: URL shortener code check ----------
const usedCodes = new BloomFilter(100000, 0.001);
usedCodes.add('S2F1lUY');

function isCodeAvailable(code) {
  if (!usedCodes.has(code)) return true; // definitely free, skip the DB call
  // "probably taken" -> confirm with the real DB (db.exists(code))
  return false;
}

console.log(isCodeAvailable('S2F1lUY')); // false
console.log(isCodeAvailable('abc1234')); // true
