const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const crypto = require('crypto');

function encodeBase62(num) {
  if (num === 0) return '0';
  let out = '';
  while (num > 0) {
    const remainder = num % 62;
    out = ALPHABET[remainder] + out; // put char at the front
    num = Math.floor(num / 62);
  }
  return out;
}

console.log(encodeBase62(125)); // "21"
console.log(encodeBase62(1000000)); // "4c92"

function decodeBase62(str) {
  let num = 0;
  for (const char of str) {
    num = num * 62 + ALPHABET.indexOf(char);
  }
  return num;
}

console.log(decodeBase62('21')); // 125
console.log(decodeBase62('4c92')); // 1000000

function encodeBase62Big(buf) {
  let num = BigInt('0x' + buf.toString('hex'));
  if (num === 0n) return '0';
  let out = '';
  while (num > 0n) {
    out = ALPHABET[Number(num % 62n)] + out;
    num = num / 62n;
  }
  return out;
}

function makeCode(longUrl, salt = 0) {
  const hash = crypto
    .createHash('sha256')
    .update(longUrl + salt)
    .digest();
  return encodeBase62Big(hash).slice(0, 7);
}

console.log(makeCode('https://example.com/products/shoes?color=red', 0));
// S2F1lUY
