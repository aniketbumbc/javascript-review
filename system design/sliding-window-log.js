/*
  SLIDING WINDOW LOG RATE LIMITER
  ===============================

  What is it?
  A rate limiting algorithm that keeps a LOG of request timestamps per client.
  Rule: "at most LIMIT requests in ANY rolling window of WINDOW ms".

  On every request at time `now`:
    1. Remove timestamps older than (now - WINDOW)   -> evict expired
    2. Count what is left in the log
    3. count < LIMIT  -> ALLOWED, push `now` into the log
       count >= LIMIT -> REJECTED (HTTP 429 Too Many Requests)

  Example (limit = 3 requests per 10s):
    t=1   log []        -> allowed  log [1]
    t=2   log [1]       -> allowed  log [1,2]
    t=5   log [1,2]     -> allowed  log [1,2,5]
    t=6   log [1,2,5]   -> REJECTED (3 already in last 10s)
    t=11  evict 1       -> log [2,5]   -> allowed  log [2,5,11]
    t=12  evict 2       -> log [5,11]  -> allowed  log [5,11,12]

  Key idea: the window SLIDES with each request (always "the last 10s"),
  instead of fixed buckets like 0-10s, 10-20s.

  Why use it?
    - EXACT: never allows more than LIMIT in any rolling window.
    - Fixes the Fixed Window "boundary burst" problem (2x LIMIT at the edge).

  Problems:
    1. Memory: stores up to LIMIT timestamps PER client -> O(LIMIT).
       1M users x 1000 req/min limit = up to 1B timestamps.
    2. CPU: eviction work on every request.
    3. Distributed: log must live in a shared store (Redis sorted set)
       and check + insert must be atomic (Lua script / MULTI).

  Compared to others:
    - Fixed Window Counter  : O(1) memory, but 2x burst at window edges.
    - Sliding Window Counter: O(1) memory, approximate (weighted prev window).
    - Token Bucket          : O(1) memory, allows bursts up to capacity.
    - Sliding Window Log    : exact, but O(LIMIT) memory.

  Real-world:
    - Good for LOW limits that must be strict: login attempts, OTP / password
      reset requests, payment APIs.
    - Redis implementation:
        ZREMRANGEBYSCORE key 0 (now - window)   // evict old
        ZCARD key                               // count
        ZADD key now <uniqueId>                 // record (if allowed)
        PEXPIRE key window                      // auto-cleanup idle users
*/

// ---------- 1. Basic Sliding Window Log ----------
// `now` is injectable so the demo can simulate time without sleeping.
class SlidingWindowLog {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.log = []; // sorted timestamps (oldest first)
  }

  _evict(now) {
    // log is sorted, so expired entries are always at the front
    while (this.log.length && this.log[0] <= now - this.windowMs) {
      this.log.shift();
    }
  }

  tryRequest(now = Date.now()) {
    this._evict(now);
    if (this.log.length < this.limit) {
      this.log.push(now);
      return true; // allowed
    }
    return false; // rate limited
  }
}

console.log('--- Limit 3 per 10s (time in seconds) ---');
const swl = new SlidingWindowLog(3, 10_000);
for (const t of [1, 2, 5, 6, 11, 12, 13]) {
  const ok = swl.tryRequest(t * 1000);
  const logSec = swl.log.map((ms) => ms / 1000);
  console.log(`t=${t}s: ${ok ? 'ALLOWED ' : 'REJECTED'}  log=[${logSec}]`);
}
// t=6 rejected, t=11 & t=12 allowed (old ones slid out), t=13 rejected

// ---------- 2. Per-user rate limiter ----------
// Each user (or IP / API key) gets their own log.
class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.logs = new Map(); // userId -> SlidingWindowLog
  }

  allow(userId, now = Date.now()) {
    if (!this.logs.has(userId)) {
      this.logs.set(userId, new SlidingWindowLog(this.limit, this.windowMs));
    }
    return this.logs.get(userId).tryRequest(now);
  }
}

console.log('\n--- Per-user limits (3 per 10s) ---');
const limiter = new RateLimiter(3, 10_000);
const requests = ['alice', 'alice', 'bob', 'alice', 'alice', 'bob'];
for (const user of requests) {
  console.log(`${user}: ${limiter.allow(user, 0) ? 'ALLOWED' : 'REJECTED (429)'}`);
}
// alice gets 3, 4th rejected; bob has his own log

// ---------- 3. Why not Fixed Window? The boundary burst ----------
// Fixed window: one counter per window id = floor(now / window).
class FixedWindowCounter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.windowId = -1;
    this.count = 0;
  }

  tryRequest(now) {
    const id = Math.floor(now / this.windowMs);
    if (id !== this.windowId) {
      this.windowId = id; // new window -> reset counter
      this.count = 0;
    }
    if (this.count < this.limit) {
      this.count++;
      return true;
    }
    return false;
  }
}

// Limit 5 per 10s. Attacker sends 5 at t=9.9s and 5 at t=10.1s.
const burst = [...Array(5).fill(9900), ...Array(5).fill(10100)];
const fixed = new FixedWindowCounter(5, 10_000);
const sliding = new SlidingWindowLog(5, 10_000);
const fixedAllowed = burst.filter((t) => fixed.tryRequest(t)).length;
const slidingAllowed = burst.filter((t) => sliding.tryRequest(t)).length;
console.log('\n--- 10 requests within 0.2s (limit 5 per 10s) ---');
console.log(`Fixed Window allowed:       ${fixedAllowed}`); // 10 -> 2x the limit!
console.log(`Sliding Window Log allowed: ${slidingAllowed}`); // 5 -> exact

// ---------- 4. Problem: memory grows with the limit ----------
// Every allowed request is stored until it slides out of the window.
const big = new RateLimiter(1000, 60_000); // 1000 req/min
for (let user = 0; user < 1000; user++) {
  for (let i = 0; i < 1000; i++) big.allow(`user-${user}`, i);
}
let stored = 0;
for (const l of big.logs.values()) stored += l.log.length;
console.log('\n--- Memory: 1000 users at 1000 req/min ---');
console.log(`timestamps stored: ${stored.toLocaleString()}`); // 1,000,000
// Token bucket / sliding window counter would store ~2 numbers per user (2,000).
