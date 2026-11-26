# System Design Algorithms

Progress: **12 / 34 done**

## Hashing / URL shortener

- [x] Consistent Hashing → [consistent-hashing.js](consistent-hashing.js)
- [x] Hash Collision handling → [hash-collion.js](hash-collion.js)
- [x] Base62 Encode / Decode → [base62-encode.js](base62-encode.js)

## Rate limiting

- [x] Token Bucket → [token-bucket.js](token-bucket.js)
- [ ] Leaky Bucket
- [ ] Fixed Window Counter
- [x] Sliding Window Log → [sliding-window-log.js](sliding-window-log.js)
- [ ] Sliding Window Counter

## Caching

- [x] LRU Cache (Least Recently Used) → [lru-cache.js](lru-cache.js)
- [x] LFU Cache (Least Frequently Used) → [lfu-cache.js](lfu-cache.js)
- [ ] TTL Cache (entries expire after a set time)

## Load balancing

- [x] Round Robin → [round-robin.js](round-robin.js)
- [ ] Weighted Round Robin
- [ ] Least Connections
- [x] IP Hash → [ip-hash.js](ip-hash.js)

## Probabilistic data structures

- [x] Bloom Filter: checks whether an item exists, saving space → [bloom-filter.js](bloom-filter.js)
- [ ] Count-Min Sketch: counts how often items appear
- [ ] HyperLogLog: counts unique items

## Distributed systems

- [ ] Snowflake ID Generator: unique IDs across machines
- [ ] Vector Clocks / Lamport Timestamps: ordering events
- [ ] Merkle Tree: finding data differences between nodes
- [x] Quorum (N/R/W) reads and writes → [quorum.js](quorum.js)
- [ ] Leader Election (Bully or Raft-style, simplified)
- [x] Gossip Protocol → [gossip-protocol.js](gossip-protocol.js)
- [ ] Two-Phase Commit (2PC)

## Search, geo and data

- [ ] Trie: autocomplete and typeahead
- [ ] Geohash / Quadtree: finding nearby locations
- [ ] Inverted Index: full-text search
- [ ] Top-K / Heavy Hitters: trending items, using a heap
- [ ] Skip List
- [ ] Reservoir Sampling

## Reliability

- [ ] Exponential Backoff with Jitter
- [ ] Circuit Breaker
- [ ] Write-Ahead Log (WAL)
