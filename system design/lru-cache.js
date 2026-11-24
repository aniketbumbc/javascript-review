/*
  LRU CACHE (Least Recently Used)
  ===============================

  What is it?
  A fixed-size cache. When it is full and a new key arrives, it evicts the
  key that was USED least recently (not read or written for the longest time).

  Operations (both O(1)):
    get(key)        -> return value and mark key as MOST recently used
    put(key, value) -> insert / update, mark as most recent;
                       if size > capacity, evict the LEAST recently used

  Example (capacity = 3), order shown oldest -> newest:
    put A        [A]
    put B        [A, B]
    put C        [A, B, C]
    get A        [B, C, A]        A moves to the end (recently used)
    put D        full -> evict B  [C, A, D]
    get B        -> miss (-1)
    put C=99     [A, D, C]        update also counts as a use

  How to get O(1)?
    HashMap         : key -> node            (O(1) lookup)
    Doubly LinkedList: order of use           (O(1) move / remove)
      head <-> [LRU] <-> ... <-> [MRU] <-> tail
    - get : find node via map, unlink it, re-insert before tail
    - put : same, and if over capacity remove node after head (the LRU)

  Why use it?
    - Recent data is likely to be used again (temporal locality).
    - Bounded memory: never grows past capacity.

  Problems:
    1. One-time scans pollute it: reading 1M rows once pushes out the
       genuinely hot keys (fix: LRU-K, 2Q, segmented LRU).
    2. Ignores frequency: a key used 1000 times is evicted after one quiet
       stretch, same as a key used once (LFU handles this).
    3. Concurrency: every get MUTATES the order -> needs a lock in
       multi-threaded caches (or approximations like CLOCK).

  Compared to others:
    - LFU : evicts least FREQUENTLY used; better for stable hot sets,
            but slow to adapt when popularity changes.
    - TTL : evicts by age, not usage; good for data that goes stale.
    - FIFO: evicts oldest INSERTED, ignores reads; simpler, worse hit rate.

  Real-world:
    - Redis: maxmemory-policy allkeys-lru (approximate: samples 5 keys,
      evicts the oldest of those instead of keeping a full list).
    - CPU caches, OS page cache, browser cache, DB buffer pools.
    - Memcached uses a segmented LRU.
*/

// ---------- 1. Classic: HashMap + Doubly Linked List ----------
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> Node
    // sentinel nodes so we never null-check at the ends
    this.head = new Node(null, null); // head.next = LRU
    this.tail = new Node(null, null); // tail.prev = MRU
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToEnd(node) {
    // insert just before tail -> most recently used
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addToEnd(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._addToEnd(node);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._addToEnd(node);

    if (this.map.size > this.capacity) {
      const lru = this.head.next;
      this._remove(lru);
      this.map.delete(lru.key);
      return lru.key; // evicted key (handy for logging)
    }
  }

  keys() {
    // oldest -> newest
    const out = [];
    for (let n = this.head.next; n !== this.tail; n = n.next) out.push(n.key);
    return out;
  }
}

console.log('--- Capacity 3 (order: LRU -> MRU) ---');
const cache = new LRUCache(3);
cache.put('A', 1);
cache.put('B', 2);
cache.put('C', 3);
console.log('put A,B,C   ', cache.keys()); // [A, B, C]
cache.get('A');
console.log('get A       ', cache.keys()); // [B, C, A]
const evicted = cache.put('D', 4);
console.log(`put D       `, cache.keys(), `evicted=${evicted}`); // [C, A, D] evicted B
console.log('get B       ', cache.get('B')); // -1 (miss)
cache.put('C', 99);
console.log('put C=99    ', cache.keys(), `C=${cache.get('C')}`); // [A, D, C]

// ---------- 2. JS shortcut: Map keeps insertion order ----------
// Delete + re-set moves a key to the end; map.keys().next() is the oldest.
// Same O(1) behaviour, far less code. Fine for JS; in interviews they
// usually want the linked list version above.
class MapLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value); // move to end (MRU)
    return value;
  }

  put(key, value) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}

console.log('\n--- Map-based LRU gives the same result ---');
const m = new MapLRU(3);
m.put('A', 1);
m.put('B', 2);
m.put('C', 3);
m.get('A');
m.put('D', 4);
console.log([...m.map.keys()]); // [C, A, D]

// ---------- 3. Use case: cache in front of a slow database ----------
let dbCalls = 0;
function slowDbFetch(userId) {
  dbCalls++;
  return { id: userId, name: `user-${userId}` };
}

function makeCachedFetch(capacity) {
  const lru = new LRUCache(capacity);
  let hits = 0;
  let misses = 0;
  return {
    fetch(userId) {
      const cached = lru.get(userId);
      if (cached !== -1) {
        hits++;
        return cached;
      }
      misses++;
      const user = slowDbFetch(userId);
      lru.put(userId, user);
      return user;
    },
    stats: () => ({ hits, misses, hitRate: `${((hits / (hits + misses)) * 100).toFixed(1)}%` }),
  };
}

// 80/20 traffic: 80% of requests hit 20 "hot" users out of 1000.
let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const service = makeCachedFetch(50);
for (let i = 0; i < 10_000; i++) {
  const userId = rand() < 0.8 ? Math.floor(rand() * 20) : 20 + Math.floor(rand() * 980);
  service.fetch(userId);
}
console.log('\n--- 10,000 requests, 80% to 20 hot users, cache size 50 ---');
console.log(service.stats(), `dbCalls=${dbCalls}`);
// Hit rate ~80%: hot users stay cached, DB load drops ~5x.

// ---------- 4. Problem: a one-time scan flushes the hot keys ----------
const hot = new LRUCache(3);
hot.put('home', 1);
hot.put('login', 2);
hot.put('cart', 3);
console.log('\n--- Scan pollution ---');
console.log('before scan ', hot.keys()); // hot pages cached
for (let i = 0; i < 3; i++) hot.put(`report-row-${i}`, i); // batch job reads rows once
console.log('after scan  ', hot.keys()); // hot pages are gone!
console.log('get home    ', hot.get('home')); // -1 -> next user request goes to DB
// LFU or 2Q would keep 'home' because it was used many times before.
