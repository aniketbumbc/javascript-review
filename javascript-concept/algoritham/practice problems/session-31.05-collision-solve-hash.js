/**
 *  Solving collision of index or key in hash where one key / index store multiple values.
 */
const word = 'niketn';

class HashTable {
  constructor() {
    this.size = 4;
    /**
     *  Create array of buckets
     */
    this.buckets = Array(4)
      .fill(null)
      .map(() => []);
  }

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
    const nestedArray = this.buckets[keyHash];
    const storeElement = nestedArray.find((ele) => {
      return ele.key === key;
    });

    if (storeElement) {
      storeElement.val = value;
    } else {
      nestedArray.push({ key, val: value });
    }
  }

  get(key) {
    const keyHash = this.hash(key);
    const findNestedArry = this.buckets[keyHash];
    const storeEle = findNestedArry.find((ele) => ele.key === key);
    return storeEle;
  }

  showInfo() {
    for (const key in this.buckets) {
      if (this.buckets[key] !== null) {
        console.log(key, this.buckets[key]);
      }
    }
  }
}

const table = new HashTable();

for (const char of word) {
  table.set(char, char);
}

console.log(table.buckets);
