/*
  TOKEN BUCKET RATE LIMITER
  =========================

  What is it?
  A rate limiting algorithm. Think of a bucket that holds tokens:
    - The bucket has a max CAPACITY (e.g. 10 tokens).
    - Tokens are added at a fixed REFILL RATE (e.g. 2 tokens / second).
    - If the bucket is full, new tokens are thrown away.
    - Each request takes 1 token.
        -> token available : request ALLOWED
        -> bucket empty    : request REJECTED (HTTP 429 Too Many Requests)

  Example (capacity = 5, refill = 1 token/sec):
    t=0s   bucket 5  -> 5 requests come in  -> all allowed, bucket 0
    t=0s   6th request                      -> rejected (bucket empty)
    t=2s   bucket refilled to 2             -> 2 requests allowed
    t=10s  idle, bucket back to 5 (capped at capacity)

  Key idea: allows BURSTS (up to capacity) but keeps the AVERAGE rate
  limited to the refill rate.

  Lazy refill trick:
  No timer needed. On each request we calculate how many tokens should have
  been added since the last request:
      tokens = min(capacity, tokens + elapsedSeconds * refillRate)

  Pros:
    - Simple, very little memory (2 numbers per user: tokens + lastRefill).
    - Allows short bursts, which matches real traffic.
  Cons:
    - Two parameters (capacity, rate) to tune.
    - In a distributed system, the bucket must live in a shared store
      (e.g. Redis + Lua script) so all servers see the same count.

  Compared to others:
    - Leaky Bucket: processes requests at a fixed constant rate (no bursts).
    - Fixed Window: simple counter per minute, but allows 2x burst at window edges.
    - Sliding Window: more accurate, more memory.

  Real-world:
    - Amazon API Gateway, Stripe API, and many others use token bucket.
    - Typical rule: "100 requests per minute per user / API key / IP".
*/

// ---------- 1. Basic Token Bucket ----------
class TokenBucket {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity; // start full
    this.lastRefill = Date.now();
  }

  _refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsedSec * this.refillRate
    );
    this.lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this._refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true; // allowed
    }
    return false; // rate limited
  }
}

// ---------- 2. Per-user rate limiter ----------
// Each user (or IP / API key) gets their own bucket.
class RateLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.buckets = new Map();
  }

  allow(userId) {
    if (!this.buckets.has(userId)) {
      this.buckets.set(userId, new TokenBucket(this.capacity, this.refillRate));
    }
    return this.buckets.get(userId).tryConsume();
  }
}

// ---------- Demo ----------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function demo() {
  // capacity 5, refill 1 token per second
  const bucket = new TokenBucket(5, 1);

  console.log('--- Burst of 7 requests ---');
  for (let i = 1; i <= 7; i++) {
    console.log(`request ${i}: ${bucket.tryConsume() ? 'ALLOWED' : 'REJECTED'}`);
  }
  // 1-5 allowed (burst), 6-7 rejected

  console.log('\n--- Wait 2 seconds (2 tokens refilled) ---');
  await sleep(2000);
  for (let i = 1; i <= 3; i++) {
    console.log(`request ${i}: ${bucket.tryConsume() ? 'ALLOWED' : 'REJECTED'}`);
  }
  // 2 allowed, 1 rejected

  console.log('\n--- Per-user limits (capacity 3) ---');
  const limiter = new RateLimiter(3, 1);
  const requests = ['alice', 'alice', 'bob', 'alice', 'alice', 'bob'];
  for (const user of requests) {
    console.log(`${user}: ${limiter.allow(user) ? 'ALLOWED' : 'REJECTED (429)'}`);
  }
  // alice gets 3, 4th rejected; bob has his own bucket

  console.log('\n--- Steady traffic: 4 req/sec against 2 tokens/sec ---');
  const steady = new TokenBucket(2, 2);
  let allowed = 0;
  let rejected = 0;
  for (let i = 0; i < 12; i++) {
    // one request every 250ms for 3 seconds
    steady.tryConsume() ? allowed++ : rejected++;
    await sleep(250);
  }
  console.log(`allowed: ${allowed}, rejected: ${rejected}`);
  // ~half allowed -> average rate held near 2/sec
}

demo();
