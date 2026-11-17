/*
  IP HASH LOAD BALANCING
  ======================

  What is it?
  A load balancing algorithm that picks a server based on the CLIENT'S IP address:
      serverIndex = hash(clientIP) % numberOfServers

  The same IP always lands on the same server -> "sticky sessions"
  without storing any session table on the load balancer.

  Example (3 servers):
    hash("192.168.1.10") % 3 = 1  -> Server B
    hash("10.0.0.5")     % 3 = 0  -> Server A
    hash("192.168.1.10") % 3 = 1  -> Server B again (same client, same server)

  Why use it?
    - Session stickiness: user's session / cart / login lives in that server's memory.
    - Better cache hit rate: the same user's data stays warm on one server.
    - Stateless LB: no lookup table, just a hash calculation.

  Problems:
    1. Adding/removing a server changes "% N" -> most clients move to a new server
       and lose their sessions. (Fix: consistent hashing, see consistent-hashing.js)
    2. Uneven load: many users behind one NAT/corporate proxy share one IP,
       so one server can get much more traffic.
    3. Server goes down -> its clients must be re-routed (session lost).
    4. Mobile users change IPs (wifi -> 4G) and jump between servers.

  Real-world:
    - Nginx:   upstream backend { ip_hash; server a; server b; }
    - HAProxy: balance source
    - AWS ELB uses cookies for stickiness instead of IP hash.
*/

const crypto = require('crypto');

// ---------- 1. Basic IP Hash ----------
class IPHashLoadBalancer {
  constructor(servers) {
    this.servers = servers;
  }

  _hash(ip) {
    // md5 -> take first 4 bytes as an unsigned 32-bit number
    return crypto.createHash('md5').update(ip).digest().readUInt32BE(0);
  }

  getServer(clientIP) {
    const index = this._hash(clientIP) % this.servers.length;
    return this.servers[index];
  }
}

const lb = new IPHashLoadBalancer(['Server-A', 'Server-B', 'Server-C']);

const clients = ['192.168.1.10', '10.0.0.5', '172.16.0.1', '8.8.8.8'];
for (const ip of clients) {
  console.log(`${ip} -> ${lb.getServer(ip)}`);
}
// Same IP again -> same server (sticky)
console.log(`192.168.1.10 again -> ${lb.getServer('192.168.1.10')}`);

// ---------- 2. Distribution check ----------
const counts = {};
for (let i = 0; i < 10000; i++) {
  const ip = `10.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`;
  const server = lb.getServer(ip);
  counts[server] = (counts[server] || 0) + 1;
}
console.log('distribution of 10,000 IPs:', counts); // roughly 1/3 each

// ---------- 3. Problem: adding a server remaps most clients ----------
const lb4 = new IPHashLoadBalancer([
  'Server-A',
  'Server-B',
  'Server-C',
  'Server-D',
]);
let moved = 0;
for (let i = 0; i < 10000; i++) {
  const ip = `10.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`;
  if (lb.getServer(ip) !== lb4.getServer(ip)) moved++;
}
console.log(`3 -> 4 servers: ${((moved / 10000) * 100).toFixed(1)}% clients moved`);
// ~75% moved -> lost sessions. Consistent hashing would move only ~25%.

// ---------- 4. Handling a down server ----------
// If the chosen server is unhealthy, try the next one (linear probing).
class HealthAwareIPHash extends IPHashLoadBalancer {
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

  getServer(clientIP) {
    const start = this._hash(clientIP) % this.servers.length;
    for (let i = 0; i < this.servers.length; i++) {
      const server = this.servers[(start + i) % this.servers.length];
      if (!this.down.has(server)) return server;
    }
    throw new Error('No healthy servers available');
  }
}

const hlb = new HealthAwareIPHash(['Server-A', 'Server-B', 'Server-C']);
const ip = '192.168.1.10';
const original = hlb.getServer(ip);
console.log(`\n${ip} normally -> ${original}`);
hlb.markDown(original);
console.log(`${original} is down, ${ip} -> ${hlb.getServer(ip)}`);
hlb.markUp(original);
console.log(`${original} is back, ${ip} -> ${hlb.getServer(ip)}`);
