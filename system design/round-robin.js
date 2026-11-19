/*
  ROUND ROBIN LOAD BALANCING
  ==========================

  What is it?
  The simplest load balancing algorithm. Requests are sent to servers
  one by one in a fixed circular order:
      request 1 -> A
      request 2 -> B
      request 3 -> C
      request 4 -> A   (back to the start)
      ...
  Formula:  server = servers[counter % servers.length], then counter++

  Why use it?
    - Very simple, O(1) per request, no state except one counter.
    - Spreads requests evenly when all servers are the same size
      and all requests take about the same time.

  Problems:
    1. Ignores server capacity: a small server gets as many requests as a big one.
       -> Fix: Weighted Round Robin.
    2. Ignores current load: a server busy with slow requests still gets new ones.
       -> Fix: Least Connections.
    3. No stickiness: the same user hits a different server each time,
       so sessions must be stored in a shared place (Redis, DB, JWT).
       -> Or use IP Hash (see ip-hash.js).
    4. Needs health checks, otherwise requests keep going to a dead server.

  Round Robin vs IP Hash:
    Round Robin -> even spread, no stickiness.
    IP Hash     -> sticky sessions, spread depends on the IPs.

  Real-world:
    - Nginx default:    upstream backend { server a; server b; server c; }
    - HAProxy:          balance roundrobin
    - DNS round robin:  one domain returns several IPs in rotating order.
    - AWS ALB:          round robin is the default routing algorithm.
*/

// ---------- 1. Basic Round Robin ----------
class RoundRobin {
  constructor(servers) {
    this.servers = servers;
    this.index = 0;
  }

  getServer() {
    const server = this.servers[this.index];
    this.index = (this.index + 1) % this.servers.length;
    return server;
  }
}

console.log('--- Basic Round Robin ---');
const rr = new RoundRobin(['Server-A', 'Server-B', 'Server-C']);
for (let i = 1; i <= 7; i++) {
  console.log(`request ${i} -> ${rr.getServer()}`);
}

// ---------- 2. Distribution check ----------
const counts = {};
for (let i = 0; i < 9000; i++) {
  const s = rr.getServer();
  counts[s] = (counts[s] || 0) + 1;
}
console.log('distribution of 9,000 requests:', counts); // exactly 3000 each

// ---------- 3. Health-aware Round Robin ----------
// Skip servers that are down; add/remove servers at runtime.
class HealthAwareRoundRobin extends RoundRobin {
  constructor(servers) {
    super(servers);
    this.down = new Set();
  }

  markDown(server) {
    this.down.add(server);
  }

  markUp(server) {
    this.down.delete(server);
  }

  addServer(server) {
    this.servers.push(server);
  }

  removeServer(server) {
    const i = this.servers.indexOf(server);
    if (i === -1) return;
    this.servers.splice(i, 1);
    if (i < this.index) this.index--; // keep the rotation in place
    if (this.index >= this.servers.length) this.index = 0;
  }

  getServer() {
    // try at most once per server
    for (let i = 0; i < this.servers.length; i++) {
      const server = super.getServer();
      if (!this.down.has(server)) return server;
    }
    throw new Error('No healthy servers available');
  }
}

console.log('\n--- Health-aware Round Robin ---');
const hrr = new HealthAwareRoundRobin(['Server-A', 'Server-B', 'Server-C']);
hrr.markDown('Server-B');
console.log('Server-B down:');
for (let i = 1; i <= 4; i++) console.log(`  request ${i} -> ${hrr.getServer()}`);

hrr.markUp('Server-B');
hrr.addServer('Server-D');
console.log('Server-B back up, Server-D added:');
for (let i = 1; i <= 4; i++) console.log(`  request ${i} -> ${hrr.getServer()}`);

hrr.removeServer('Server-A');
console.log('Server-A removed:');
for (let i = 1; i <= 3; i++) console.log(`  request ${i} -> ${hrr.getServer()}`);

// ---------- 4. Problem: unequal servers ----------
// Server-A can handle 10 req/sec, Server-B only 2 req/sec.
// Round robin sends 50% to each -> Server-B gets overloaded.
console.log('\n--- Problem: unequal capacity ---');
const capacity = { 'Big-Server': 10, 'Small-Server': 2 };
const rr2 = new RoundRobin(Object.keys(capacity));
const load = { 'Big-Server': 0, 'Small-Server': 0 };
for (let i = 0; i < 12; i++) load[rr2.getServer()]++; // 12 req in 1 second
for (const [s, n] of Object.entries(load)) {
  const status = n > capacity[s] ? 'OVERLOADED' : 'ok';
  console.log(`${s}: ${n} req, capacity ${capacity[s]} -> ${status}`);
}
// -> This is why Weighted Round Robin exists (next topic).
