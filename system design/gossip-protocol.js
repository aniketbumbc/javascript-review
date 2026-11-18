/*
  GOSSIP PROTOCOL
  ===============

  What is it?
  A way for nodes in a cluster to share information WITHOUT a central server,
  the same way a rumor spreads among people:
    - Every T seconds (a "round"), each node picks a few RANDOM peers (fanout).
    - It sends them what it knows. They merge it with what they know.
    - Next round, those peers gossip to others... and so on.

  Spread speed:
    Round 0: 1 node knows
    Round 1: ~2 nodes
    Round 2: ~4 nodes
    Round 3: ~8 nodes     -> doubles each round (like an epidemic)
    => Everyone knows in about O(log N) rounds.
       1,000 nodes ≈ 10 rounds, 1,000,000 nodes ≈ 20 rounds.

  Two common uses:
  1. Spreading data / updates (a "rumor"):
       e.g. "config version 5 is out", "key X changed".
       Each piece of data has a VERSION, higher version wins on merge.

  2. Membership + failure detection:
       Each node keeps a table: { nodeId: heartbeatCounter, lastUpdatedTime }
       - A node increments its OWN heartbeat every round.
       - Tables are gossiped and merged (keep the higher heartbeat).
       - If a node's heartbeat hasn't gone up for X seconds -> mark it SUSPECT/DEAD.
       No single node has to ping everyone, so it scales to big clusters.

  Pros:
    - Decentralized: no single point of failure.
    - Scalable: each node talks to only a few peers per round.
    - Fault tolerant: lost messages / dead nodes don't stop the spread.
  Cons:
    - Eventually consistent: there's a short time when nodes disagree.
    - Duplicate messages (nodes hear the same thing many times).
    - Hard to debug, timing is random.

  Real-world:
    - Cassandra & DynamoDB-style stores: cluster membership, ring state.
    - Consul / Serf (HashiCorp): SWIM gossip protocol for membership.
    - Redis Cluster: nodes gossip about slots and failures.
    - Bitcoin / blockchains: spreading transactions and blocks.
*/

// Seeded random so the output is the same every run (Math.random works too)
let seed = 42;
function random() {
  seed = (seed * 1103515245 + 12345) % 2 ** 31;
  return seed / 2 ** 31;
}

class Node {
  constructor(id) {
    this.id = id;
    this.alive = true;
    this.data = {}; // { key: { value, version } }
    this.membership = {}; // { nodeId: { heartbeat, lastSeenRound } }
  }

  // Update local data (bumps the version)
  set(key, value) {
    const version = (this.data[key]?.version || 0) + 1;
    this.data[key] = { value, version };
  }

  // Merge data received from a peer: higher version wins
  mergeData(incoming) {
    for (const [key, entry] of Object.entries(incoming)) {
      const mine = this.data[key];
      if (!mine || entry.version > mine.version) {
        this.data[key] = { ...entry };
      }
    }
  }

  // Merge membership table: higher heartbeat wins
  mergeMembership(incoming, round) {
    for (const [id, info] of Object.entries(incoming)) {
      const mine = this.membership[id];
      if (!mine || info.heartbeat > mine.heartbeat) {
        this.membership[id] = { heartbeat: info.heartbeat, lastSeenRound: round };
      }
    }
  }
}

class Cluster {
  constructor(size, fanout = 2, failTimeout = 4) {
    this.nodes = Array.from({ length: size }, (_, i) => new Node(`N${i}`));
    this.fanout = fanout; // peers contacted per round
    this.failTimeout = failTimeout; // rounds without heartbeat => dead
    this.round = 0;
  }

  _randomPeers(node) {
    const others = this.nodes.filter((n) => n !== node);
    const peers = [];
    while (peers.length < this.fanout && others.length > 0) {
      const i = Math.floor(random() * others.length);
      peers.push(others.splice(i, 1)[0]);
    }
    return peers;
  }

  // One gossip round: every alive node bumps its heartbeat and gossips
  gossipRound() {
    this.round++;

    // increase own heartbeat
    for (const node of this.nodes) {
      if (!node.alive) continue;
      const me = node.membership[node.id] || { heartbeat: 0 };
      node.membership[node.id] = {
        heartbeat: me.heartbeat + 1,
        lastSeenRound: this.round,
      };
    }

    // snapshot: in a real network all nodes gossip at the same time,
    // so news received this round is only passed on NEXT round
    const snapshot = new Map(
      this.nodes.map((n) => [
        n,
        {
          data: structuredClone(n.data),
          membership: structuredClone(n.membership),
        },
      ])
    );

    for (const node of this.nodes) {
      if (!node.alive) continue;
      // send state to random peers (dead peers just don't respond)
      for (const peer of this._randomPeers(node)) {
        if (!peer.alive) continue;
        peer.mergeData(snapshot.get(node).data);
        peer.mergeMembership(snapshot.get(node).membership, this.round);
      }
    }
  }

  countKnowing(key, version) {
    return this.nodes.filter((n) => n.data[key]?.version >= version).length;
  }

  // What does `observer` think about other nodes?
  suspectedDead(observer) {
    return Object.entries(observer.membership)
      .filter(([, info]) => this.round - info.lastSeenRound > this.failTimeout)
      .map(([id]) => id);
  }
}

// ---------- Demo 1: spreading an update ----------
console.log('--- Demo 1: spread a config update to 32 nodes ---');
const cluster = new Cluster(32, 2);
cluster.nodes[0].set('config', 'v2');

let round = 0;
while (cluster.countKnowing('config', 1) < cluster.nodes.length) {
  cluster.gossipRound();
  round++;
  console.log(
    `round ${round}: ${cluster.countKnowing('config', 1)}/32 nodes know`
  );
}
console.log(`log2(32) = ${Math.log2(32)} -> spread in ${round} rounds`);

// ---------- Demo 2: conflicting versions, latest wins ----------
console.log('\n--- Demo 2: newer version overrides older ---');
cluster.nodes[5].set('config', 'v3'); // version 2 now
for (let i = 0; i < 6; i++) cluster.gossipRound();
const values = new Set(cluster.nodes.map((n) => n.data.config.value));
console.log('values in cluster after 6 rounds:', [...values]); // ['v3']

// ---------- Demo 3: failure detection ----------
console.log('\n--- Demo 3: detect a dead node ---');
const c2 = new Cluster(16, 2, 4);
for (let i = 0; i < 5; i++) c2.gossipRound(); // let membership spread
console.log(`N0 knows ${Object.keys(c2.nodes[0].membership).length}/16 members`);

c2.nodes[7].alive = false;
console.log('N7 crashed!');

for (let i = 1; i <= 10; i++) {
  c2.gossipRound();
  const aliveNodes = c2.nodes.filter((n) => n.alive);
  const detected = aliveNodes.filter((n) =>
    c2.suspectedDead(n).includes('N7')
  ).length;
  console.log(`round +${i}: ${detected}/${aliveNodes.length} nodes think N7 is dead`);
  if (detected === aliveNodes.length) break;
}
