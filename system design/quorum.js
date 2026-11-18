/*
  QUORUM READS AND WRITES (N / R / W)
  ===================================

  What is it?
  In a replicated database, each key is copied to N nodes (replicas).
  Instead of waiting for ALL replicas on every request, we wait for only some:
    N = number of replicas holding the key
    W = replicas that must confirm a WRITE before it counts as successful
    R = replicas we must hear from on a READ

  The golden rule:
      R + W > N   =>  the read set and write set ALWAYS overlap
                      in at least 1 node, so a read sees the latest write.

  Example (N = 3, W = 2, R = 2):
    Replicas:      A     B     C
    write x=5  ->  ✔     ✔     ✘ (slow / down)       2 acks = W, success
    read x     ->        ✔     ✔                     B has x=5 (v2), C has x=1 (v1)
                                                     pick highest version -> 5 ✔
    Any 2 of 3 always shares a node with any other 2 of 3.

  Each value carries a VERSION (timestamp / counter / vector clock),
  so the reader picks the newest one among the R replies.

  Common settings (N = 3):
    W=2, R=2  -> balanced, strong reads, tolerates 1 node down     (most common)
    W=3, R=1  -> fast reads, but writes fail if any node is down
    W=1, R=3  -> fast writes, slow reads
    W=1, R=1  -> fastest, but R+W = 2 <= 3 -> may read STALE data (eventual consistency)

  Fault tolerance:
    Writes keep working with up to (N - W) nodes down.
    Reads keep working with up to (N - R) nodes down.

  Read repair:
    If a read sees that some replicas have an older version,
    it sends them the newest value in the background so they catch up.

  Pros:
    - Tunable: choose consistency vs latency vs availability per use case.
    - No single leader needed (Dynamo-style, leaderless replication).
  Cons:
    - Even with R + W > N, edge cases exist (concurrent writes, sloppy quorum,
      failed writes partly applied), so it's not full linearizability.
    - Needs conflict resolution (last-write-wins or vector clocks).

  Real-world:
    - Amazon Dynamo / DynamoDB, Cassandra (consistency level QUORUM / ONE / ALL),
      Riak, ScyllaDB.
    - Raft/Paxos also use majority quorums (N/2 + 1) to elect leaders.
*/

// Seeded random so the output is the same every run
let seed = 7;
function random() {
  seed = (seed * 1103515245 + 12345) % 2 ** 31;
  return seed / 2 ** 31;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class Replica {
  constructor(name) {
    this.name = name;
    this.up = true;
    this.store = {}; // { key: { value, version } }
  }

  write(key, value, version) {
    if (!this.up) return false;
    const current = this.store[key];
    if (!current || version > current.version) {
      this.store[key] = { value, version };
    }
    return true; // ack
  }

  read(key) {
    if (!this.up) return null;
    return this.store[key] || { value: undefined, version: 0 };
  }
}

class QuorumStore {
  constructor({ N, R, W, readRepair = true }) {
    this.N = N;
    this.R = R;
    this.W = W;
    this.readRepair = readRepair;
    this.replicas = Array.from(
      { length: N },
      (_, i) => new Replica(String.fromCharCode(65 + i)) // A, B, C...
    );
    this.version = 0; // simple global counter (real systems: timestamps / vector clocks)
  }

  // Send the write to replicas; succeed once W of them ack.
  // (Real systems send to all N in parallel; here random order = network timing,
  //  and we stop after W acks to show replicas that missed the write.)
  put(key, value) {
    const version = ++this.version;
    let acks = 0;
    const acked = [];
    for (const replica of shuffle(this.replicas)) {
      if (acks === this.W) break;
      if (replica.write(key, value, version)) {
        acks++;
        acked.push(replica.name);
      }
    }
    if (acks < this.W) {
      return { ok: false, reason: `only ${acks}/${this.W} acks`, acked };
    }
    return { ok: true, version, acked };
  }

  // Ask replicas; succeed once R reply. Return the newest version.
  get(key) {
    const replies = [];
    for (const replica of shuffle(this.replicas)) {
      if (replies.length === this.R) break;
      const res = replica.read(key);
      if (res) replies.push({ replica, ...res });
    }
    if (replies.length < this.R) {
      return { ok: false, reason: `only ${replies.length}/${this.R} replies` };
    }

    const newest = replies.reduce((a, b) => (b.version > a.version ? b : a));

    // Read repair: bring stale replicas up to date
    const repaired = [];
    if (this.readRepair) {
      for (const r of replies) {
        if (r.version < newest.version) {
          r.replica.write(key, newest.value, newest.version);
          repaired.push(r.replica.name);
        }
      }
    }

    return {
      ok: true,
      value: newest.value,
      version: newest.version,
      askedReplicas: replies.map((r) => `${r.replica.name}(v${r.version})`),
      repaired,
    };
  }

  dump(key) {
    return this.replicas
      .map((r) => `${r.name}:${r.up ? `v${r.store[key]?.version || 0}` : 'DOWN'}`)
      .join('  ');
  }
}

// ---------- Demo 1: N=3, W=2, R=2 (R + W > N) ----------
console.log('--- Demo 1: N=3 W=2 R=2 (strong reads) ---');
const store = new QuorumStore({ N: 3, R: 2, W: 2 });
store.put('cart', ['shoes']);
const w = store.put('cart', ['shoes', 'hat']);
console.log('write acked by:', w.acked, '| replicas:', store.dump('cart'));
const r = store.get('cart');
console.log('read asked:', r.askedReplicas, '->', r.value);
console.log('read repaired:', r.repaired, '| replicas:', store.dump('cart'));

// ---------- Demo 2: stale reads when R + W <= N ----------
console.log('\n--- Demo 2: R + W > N vs R + W <= N (1000 write+read pairs) ---');
function staleRate(config) {
  const s = new QuorumStore({ ...config, readRepair: false });
  let stale = 0;
  for (let i = 1; i <= 1000; i++) {
    s.put('x', i);
    if (s.get('x').value !== i) stale++;
  }
  return stale;
}
for (const cfg of [
  { N: 3, W: 2, R: 2 },
  { N: 3, W: 3, R: 1 },
  { N: 3, W: 1, R: 3 },
  { N: 3, W: 1, R: 1 },
  { N: 5, W: 2, R: 2 },
]) {
  const overlap = cfg.R + cfg.W > cfg.N ? 'R+W>N ' : 'R+W<=N';
  console.log(
    `N=${cfg.N} W=${cfg.W} R=${cfg.R}  ${overlap} -> stale reads: ${staleRate(cfg)}/1000`
  );
}

// ---------- Demo 3: node failures ----------
console.log('\n--- Demo 3: failures with N=3 W=2 R=2 ---');
const s3 = new QuorumStore({ N: 3, R: 2, W: 2 });
s3.put('user', 'Aniket');

s3.replicas[0].up = false; // A goes down
console.log('A down   |', s3.dump('user'));
console.log('  write:', s3.put('user', 'Aniket B').ok ? 'OK' : 'FAILED');
console.log('  read :', s3.get('user').value);

s3.replicas[1].up = false; // B goes down too
console.log('A,B down |', s3.dump('user'));
const fw = s3.put('user', 'X');
console.log('  write:', fw.ok ? 'OK' : `FAILED (${fw.reason})`);
const fr = s3.get('user');
console.log('  read :', fr.ok ? fr.value : `FAILED (${fr.reason})`);
// Only 1 of 3 nodes left -> can't reach W=2 or R=2 -> unavailable (choosing consistency)
