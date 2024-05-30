/**
 *  Hash table  can follow index and value.
 *  if object has key and value. Key entry point to store as index.
 *  Process key as index using hashing to store as index
 */

/**
 *  Find first repeating character
 */

const word = 'niketn';

function findFirstRepeatChar(str) {
  const tempObj = {};
  for (let char of str) {
    if (tempObj[char]) {
      return char;
    }
    tempObj[char] = 1;
  }
}

console.log(findFirstRepeatChar(word));

/**
 *  Hash table
 *  Index and value
 */

class HashTable {
  constructor() {
    this.size = 1000;
    this.buckets = Array(100).fill(null);
  }

  /**
   *  return index from array as number
   * @param { } key
   */

  hash(key) {
    let hash = 0;
    for (const char of key) {
      hash += char.charCodeAt(0);
    }

    return hash % this.size;
  }

  /**
   *  set key and value
   */

  set(key, value) {
    const keyHash = this.hash(key);
    this.buckets[keyHash] = value;

    console.log(this.buckets);
  }

  get(key) {
    const keyHash = this.hash(key);
    console.log(keyHash);
    return this.buckets[keyHash];
  }

  showInfo() {
    for (const key in this.buckets) {
      if (this.buckets[key] !== null) {
        console.log(key, this.buckets[key]);
      }
    }
  }
}

const h1 = new HashTable();

h1.set('aaa', 1);
h1.set('b', 2);
h1.set('c', 3);

console.log(h1.get('c'));
