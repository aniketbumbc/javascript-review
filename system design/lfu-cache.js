/*
  LFU CACHE (Least Frequently Used)
  =================================

  What is it?
  A fixed-size cache. When it is full and a new key arrives, it evicts the
  key that was used the FEWEST times. If several keys tie on count, it
  evicts the least recently used of them (LRU as the tie-breaker).

  Operations (both O(1)):
    get(key)        -> return value, count += 1
    put(key, value) -> insert with count = 1, or update and count += 1;
                       if full, evict a key with the lowest count first

  Example (capacity = 3), shown as key:count:
    put A, B, C   A:1 B:1 C:1
    get A         A:2 B:1 C:1
    get A         A:3 B:1 C:1
    get B         A:3 B:2 C:1
    put D         full -> evict C (lowest count)   A:3 B:2 D:1
    put E         full -> evict D (lowest count)   A:3 B:2 E:1
    get C         -> miss (-1)
    put F         full -> evict E  (A and B survive because they are popular)

  How to get O(1)?
    keyMap  : key   -> { value, freq }
    freqMap : freq  -> ordered set of keys with that count
                       (JS Set keeps insertion order -> first key = LRU in that bucket)
    minFreq : the lowest count currently in the cache
    - get/put on existing key: move key from bucket f to bucket f+1;
      if bucket f is now empty and f was minFreq, minFreq = f + 1
    - new key: if full, evict first key of freqMap[minFreq];
      then insert with freq 1 and set minFreq = 1

  Why use it?
    - Keeps keys that are popular over a long period (stable hot set).
    - A one-time scan cannot flush the hot keys (the main weakness of LRU):
      scanned keys have count 1 and are evicted first.

  Problems:
    1. Stale popularity: a key that was hot yesterday keeps a big count and
       stays forever, even if nobody asks for it now (fix: aging / decay,
       e.g. halve all counts periodically; Redis LFU decays counters).
    2. New keys are fragile: they start at count 1, so they are the first to
       be evicted, even if they are about to become hot.
    3. More bookkeeping than LRU (counts + buckets + minFreq).

  Compared to others:
    - LRU : evicts least RECENTLY used; adapts fast, but scans pollute it.
    - TTL : evicts by age; good for data that goes stale.
    - W-TinyLFU (Caffeine, Java): small LRU window + frequency sketch;
            gets the best of both, used in production caches.

  Real-world:
    - Redis: maxmemory-policy allkeys-lfu (approximate: 8-bit logarithmic
      counter per key that decays over time).
    - CDNs / content caches for long-term popular assets.
    - Caffeine (Java) uses TinyLFU for admission decisions.
*/

// ---------- 1. Classic O(1) LFU: key map + frequency buckets ----------
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyMap = new Map(); // key -> { value, freq }
    this.freqMap = new Map(); // freq -> Set of keys (insertion order = LRU first)
    this.minFreq = 0;
  }

  _bump(key) {
    // move key from bucket f to bucket f+1
    const entry = this.keyMap.get(key);
    const f = entry.freq;
    const bucket = this.freqMap.get(f);
    bucket.delete(key);
    if (bucket.size === 0) {
      this.freqMap.delete(f);
      if (this.minFreq === f) this.minFreq = f + 1;
    }
    entry.freq = f + 1;
    if (!this.freqMap.has(f + 1)) this.freqMap.set(f + 1, new Set());
    this.freqMap.get(f + 1).add(key);
  }

  get(key) {
    if (!this.keyMap.has(key)) return -1;
    this._bump(key);
    return this.keyMap.get(key).value;
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    if (this.keyMap.has(key)) {
      this.keyMap.get(key).value = value;
      this._bump(key); // update also counts as a use
      return;
    }

    let evicted;
    if (this.keyMap.size >= this.capacity) {
      // lowest count bucket, oldest key in it
      const bucket = this.freqMap.get(this.minFreq);
      evicted = bucket.values().next().value;
      bucket.delete(evicted);
      if (bucket.size === 0) this.freqMap.delete(this.minFreq);
      this.keyMap.delete(evicted);
    }

    this.keyMap.set(key, { value, freq: 1 });
    if (!this.freqMap.has(1)) this.freqMap.set(1, new Set());
    this.freqMap.get(1).add(key);
    this.minFreq = 1; // a brand-new key always has the lowest count
    return evicted; // evicted key (handy for logging)
  }

  snapshot() {
    // "key:count" sorted by count, high -> low
    return [...this.keyMap]
      .sort((a, b) => b[1].freq - a[1].freq)
      .map(([k, e]) => `${k}:${e.freq}`)
      .join(' ');
  }
}

console.log('--- Capacity 3 (key:count) ---');
const cache = new LFUCache(3);
cache.put('A', 1);
cache.put('B', 2);
cache.put('C', 3);
console.log('put A,B,C   ', cache.snapshot()); // A:1 B:1 C:1
cache.get('A');
cache.get('A');
cache.get('B');
console.log('get A,A,B   ', cache.snapshot()); // A:3 B:2 C:1
let evicted = cache.put('D', 4);
console.log('put D       ', cache.snapshot(), `evicted=${evicted}`); // evicted C
evicted = cache.put('E', 5);
console.log('put E       ', cache.snapshot(), `evicted=${evicted}`); // evicted D
console.log('get C       ', cache.get('C')); // -1 (miss)

// Tie-break: same count -> evict the least recently used of them
const tie = new LFUCache(2);
tie.put('X', 1);
tie.put('Y', 2); // X:1 Y:1, X is older
console.log('\n--- Tie-break ---');
console.log('put Z       ', `evicted=${tie.put('Z', 3)}`); // X (older of the two count-1 keys)

// ---------- 2. Where LFU beats LRU: a one-time scan ----------
// Same scenario that flushed the hot keys in lru-cache.js.
const hot = new LFUCache(3);
hot.put('home', 1);
hot.put('login', 2);
hot.put('cart', 3);
for (let i = 0; i < 5; i++) {
  hot.get('home');
  hot.get('login');
}
console.log('\n--- Scan resistance ---');
console.log('before scan ', hot.snapshot()); // home:6 login:6 cart:1
for (let i = 0; i < 3; i++) hot.put(`report-row-${i}`, i); // batch job reads rows once
console.log('after scan  ', hot.snapshot()); // home and login survive
console.log('get home    ', hot.get('home')); // 1 -> still cached

// ---------- 3. Use case: cache in front of a slow database ----------
let dbCalls = 0;
function slowDbFetch(userId) {
  dbCalls++;
  return { id: userId, name: `user-${userId}` };
}

function makeCachedFetch(capacity) {
  const lfu = new LFUCache(capacity);
  let hits = 0;
  let misses = 0;
  return {
    fetch(userId) {
      const cached = lfu.get(userId);
      if (cached !== -1) {
        hits++;
        return cached;
      }
      misses++;
      const user = slowDbFetch(userId);
      lfu.put(userId, user);
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
// Hot users build up big counts and never leave; cold users churn in the
// count-1 bucket. Hit rate is about the same or a bit higher than LRU.

// ---------- 4. Problem: stale popularity (yesterday's hot key never leaves) ----------
const news = new LFUCache(2);
news.put('old-story', 'yesterday');
for (let i = 0; i < 100; i++) news.get('old-story'); // was viral yesterday
console.log('\n--- Stale popularity ---');
// Today a new story is popular, but each new key starts at count 1
// and gets evicted by the next new key before it can build up a count.
news.put('today-1', 'a');
news.get('today-1');
news.put('today-2', 'b'); // evicts today-1 (count 2), not old-story (count 101)
console.log('cache       ', news.snapshot()); // old-story:101 today-2:1
console.log('get today-1 ', news.get('today-1')); // -1 -> today's hot story misses
// Fix: decay counts over time (halve every N minutes) or use W-TinyLFU.
