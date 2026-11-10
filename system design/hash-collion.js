const crypto = require('crypto');
const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function base62(buf) {
  let num = BigInt('0x' + buf.toString('hex'));
  let out = '';
  while (num > 0n) {
    out = ALPHABET[Number(num % 62n)] + out;
    num /= 62n;
  }
  return out;
}

function makeCode(longUrl, salt) {
  const hash = crypto
    .createHash('sha256')
    .update(longUrl + salt)
    .digest();
  return base62(hash).slice(0, 7);
}

async function createShortUrl(longUrl) {
  for (let salt = 0; salt < 5; salt++) {
    const code = makeCode(longUrl, salt);

    const existing = await db.findByCode(code); // Step 5
    if (!existing) {
      await db.insert({ code, longUrl }); // free, so save it
      return code;
    }
    if (existing.longUrl === longUrl) return code; // same URL, reuse
    // otherwise collision, so loop with the next salt (Step 6)
  }
  throw new Error('Could not generate unique code');
}
