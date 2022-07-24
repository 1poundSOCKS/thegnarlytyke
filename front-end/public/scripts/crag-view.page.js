(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

var _nil = _interopRequireDefault(require("./nil.js"));

var _version = _interopRequireDefault(require("./version.js"));

var _validate = _interopRequireDefault(require("./validate.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nil.js":3,"./parse.js":4,"./stringify.js":8,"./v1.js":9,"./v3.js":10,"./v4.js":12,"./v5.js":13,"./validate.js":14,"./version.js":15}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';

  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;
},{"./validate.js":14}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);

  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);

    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }

    M[i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);

    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }

    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;
},{"./validate.js":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":6,"./stringify.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./md5.js":2,"./v35.js":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./parse.js":4,"./stringify.js":8}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./rng.js":6,"./stringify.js":8}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./sha1.js":7,"./v35.js":11}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(require("./regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;
},{"./regex.js":5}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;
},{"./validate.js":14}],16:[function(require,module,exports){
const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require("./objects/image-storage.cjs");
const CragIndex = require('./objects/crag-index.cjs');
const CragStorage = require('./objects/crag-storage.cjs');
const Crag = require('./objects/crag.cjs');
const PageHeader = require('./objects/page-header.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');
const Cookie = require('./objects/cookie.cjs')

let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();
  const loggedOn = cookie.IsUserLoggedOn();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');

  _pageHeader = new PageHeader(document.getElementById("page-header"));
  if( Config.mode === "edit" && loggedOn ) _pageHeader.AddIcon("fa-edit","Edit").onclick = () => window.location.href = `crag-edit.html?id=${cragID}`;

  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  const cragIndex = new CragIndex();
  const cragIndexData = await cragIndex.Load(DataStorage);
  const cragIndexEntry = cragIndexData.crags.filter(crag => crag.id == cragID)[0];

  try {
    const cragStorage = new CragStorage('client', Config);
    _crag = await cragStorage.Load(cragID);
  }
  catch ( err ) {
    _crag = new Crag({id:cragID});
  }

  document.getElementById('crag-name').innerText = cragIndexEntry.name;    

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = new Crag(_crag).GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}

},{"./objects/config.cjs":17,"./objects/cookie.cjs":18,"./objects/crag-index.cjs":19,"./objects/crag-storage.cjs":20,"./objects/crag.cjs":21,"./objects/data-storage.cjs":22,"./objects/image-storage.cjs":23,"./objects/page-header.cjs":24,"./objects/topo-image.cjs":28,"./objects/topo-media-scroller.cjs":29,"./objects/topo-route-table.cjs":31}],17:[function(require,module,exports){
let Config = function() {
}

Config.prototype.Load = async function() {
  const response = await fetch('config.json', {cache: "reload"});
  const configData = await response.json();
  Object.assign(this, configData);
}

module.exports = new Config;

},{}],18:[function(require,module,exports){
let Cookie = function() {
  this.RefreshCache();
}

Cookie.prototype.RefreshCache = function() {
  this.value = document.cookie;
  this.values = this.value.split('; ');
  this.valuesMap = new Map(
    this.values.map(value => {
      const keyAndValue = value.split('=')
      return [keyAndValue[0], keyAndValue[1]];
    }),
  );
}

Cookie.prototype.SetValue = function(name, value) {
  document.cookie = `${name}=${value}`;
  this.RefreshCache();
}

Cookie.prototype.GetValue = function(name) {
  return this.valuesMap.get(name);
}

Cookie.prototype.IsUserLoggedOn = function() {
  const userID = this.GetValue("user-id")
  const userToken = this.GetValue("user-token")
  return userID?.length > 0 && userToken?.length > 0 ? true : false;
}

Cookie.prototype.Logoff = function() {
  this.SetValue("user-id","")
  this.SetValue("user-token","")
}

module.exports = Cookie;

},{}],19:[function(require,module,exports){
let uuid = require('uuid');

let CragIndex = function() {
  this.data = null;
}

CragIndex.prototype.Load = async function(dataStorage, imageStorage) {
  this.data = await dataStorage.Load('crag-index');
  this.data.crags.forEach( crag => delete crag.imageLoader )
  if( imageStorage ) this.data.crags.forEach( crag => this.LoadCragImage(imageStorage, crag) )
  return this.data;
}

CragIndex.prototype.LoadForUserEdit = async function(dataStorage, imageStorage) {
  this.data = await dataStorage.LoadForUserEdit('crag-index');
  this.data.crags.forEach( crag => delete crag.imageLoader )
  if( imageStorage ) this.data.crags.forEach( crag => this.LoadCragImage(imageStorage, crag) )
  return this.data;
}

CragIndex.prototype.LoadCragImage = async function(imageStorage, crag) {
  if( !crag.imageFile ) return
  crag.imageLoader = imageStorage.LoadImageFromFile(crag.imageFile);
}

CragIndex.prototype.AppendCrag = function() {
  const cragCount = this.data.crags.push({id: uuid.v4(),name:"NEW CRAG"})
  return this.data.crags[cragCount-1]
}

CragIndex.prototype.Save = async function(dataStorage, imageStorage) {
  const imageSaves = [];
  this.data.crags.forEach( crag => {
    imageSaves.push(this.SaveCragImage(imageStorage, crag))
  })

  await Promise.all(imageSaves);
  return dataStorage.Save('crag-index', this.data);
}

CragIndex.prototype.SaveCragImage = async function(imageStorage, crag) {
  if( crag.imageData ) {
    const response = await imageStorage.SaveImage(crag.id, crag.imageData, "crag")
    crag.imageFile = response.filename;
    delete crag.imageData;
  }
}

module.exports = CragIndex;

},{"uuid":1}],20:[function(require,module,exports){
const Config = require('./config.cjs');
const Crag = require('./crag.cjs');

let CragStorage = function(type, config) {
  this.type = type;
  if( config ) {
    this.dataURL = config.data_url;
    this.saveCragURL = config.save_crag_url;
  }
}

CragStorage.prototype.Load = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.LoadFromClient(id);
  }
}

CragStorage.prototype.Save = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.SaveFromClient(id);
  }
}

CragStorage.prototype.LoadFromClient = async function(id) {
  const cragURL = `${this.dataURL}${id}.crag.json`;
  let loadedString = await fetch(cragURL, {cache: "reload"});
  let crag = await loadedString.json();
  this.UpdateCragAfterRestore(crag);
  return crag;
}

CragStorage.prototype.SaveFromClient = async function(crag) {
  const cragToStore = this.FormatCragForStorage(crag);
  const requestBody = JSON.stringify(cragToStore);
  const url = `${this.saveCragURL}?id=${crag.id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response;
}

CragStorage.prototype.UpdateCragAfterRestore = function(crag) {
  const routeInfoMap = new Map();
  if( crag.routes ) crag.routes.forEach( route => routeInfoMap.set(route.id, route) );

  const pointArray = [];
  const pointMap = new Map();

  const toposWithRoutes = crag.topos.filter( topo => topo.routes && topo.routes.length > 0 );

  toposWithRoutes.forEach( topo => {
    topo.routes.forEach( route => {
      route.info = routeInfoMap.get(route.id);
      route.points.forEach( point => {
        pointArray.push(point);
        pointMap.set(point.id, point);
      });
    });
  });

  pointArray.forEach( point => {
    if( point.attachedTo ) point.attachedTo = pointMap.get(point.attachedTo);
  });
}

CragStorage.prototype.FormatCragForStorage = function(crag) {
  const cragForStorage = {};
  if( crag.id ) cragForStorage.id = crag.id;
  if( crag.name ) cragForStorage.name = crag.name;
  if( crag.routes ) cragForStorage.routes = this.FormatRoutesForStorage(crag.routes);
  if( crag.topos ) cragForStorage.topos = this.FormatToposForStorage(crag.topos);
  return cragForStorage;
}

CragStorage.prototype.FormatRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      name: route.name,
      grade: route.grade
    };
  });
}

CragStorage.prototype.FormatToposForStorage = function(topos) {
  return topos.map( topo => {
    const topoForStorage = {};
    if( topo.id ) topoForStorage.id = topo.id;
    if( topo.imageFile ) topoForStorage.imageFile = topo.imageFile;
    if( topo.routes ) topoForStorage.routes = this.FormatTopoRoutesForStorage(topo.routes);
    return topoForStorage;
  });
}

CragStorage.prototype.FormatTopoRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      points: this.FormatPointsForStorage(route.points)
    };
  });
}

CragStorage.prototype.FormatPointsForStorage = function(points) {
  if( !points ) return [];
  return points.map( point => {
    const pointToSave = {id: point.id};
    if( point.attachedTo ) {
      pointToSave.attachedTo = point.attachedTo.id;
    }
    else {
      pointToSave.x = point.x;
      pointToSave.y = point.y;
    }
    return pointToSave;
  });
}

module.exports = CragStorage;

},{"./config.cjs":17,"./crag.cjs":21}],21:[function(require,module,exports){
let uuid = require('uuid');
const Route = require('./route.cjs');

let Crag = function(cragObject) {
  if( cragObject ) {
    this.Attach(cragObject);
  }
  else {
    this.id = uuid.v4();
    this.routes = [];
    this.topos = [];
  }
}

Crag.prototype.Attach = function(cragObject) {
  this.id = cragObject.id;
  this.name = cragObject.name;
  this.routes = cragObject.routes ? cragObject.routes : [];
  this.topos = cragObject.topos ? cragObject.topos : [];
}

Crag.prototype.Save = async function(dataStorage) {
  const cragData = this.FormatForStorage();
  return dataStorage.Save(`${this.id}.crag`, cragData);
}

Crag.prototype.AppendTopo = function(topo) {
  return this.topos.push(topo);
}

Crag.prototype.GetTopoIndex = function(topoID) {
  const indexedTopos = this.topos.map( (topo, index) => {
    return {topo: topo, index: index}
  });
  const matchingTopos = indexedTopos.filter(indexedTopo => indexedTopo.topo.id === topoID);
  if( matchingTopos.length != 1 ) return -1;
  return matchingTopos[0].index;
}

Crag.prototype.GetLastTopoIndex = function () {
  return this.topos.length - 1;
}

Crag.prototype.SwapTopos = function(index1, index2) {
  const firstTopo = this.topos[index1];
  this.topos[index1] = this.topos[index2];
  this.topos[index2] = firstTopo;
}

Crag.prototype.GetMatchingTopo = function(id) {
  let matchingTopos = this.topos.filter( topo => topo.id === id );
  if( matchingTopos.length != 1 ) return null;
  return matchingTopos[0];
}

Crag.prototype.GetMatchingRoute = function(id) {
  if( !this.routes ) return null;
  let matchingRoutes =  this.routes.filter( route => route.id === id);
  if( matchingRoutes.length != 1 ) return null;
  return matchingRoutes[0];
}

Crag.prototype.AppendRoute = function(name, grade) {
  const route = new Route().route;
  route.name = name;
  route.grade = grade;
  this.routes.push(route);
  return route;
}

Crag.prototype.FormatForStorage = function() {
  const cragForStorage = {};
  if( this.id ) cragForStorage.id = this.id;
  if( this.name ) cragForStorage.name = this.name;
  if( this.routes ) cragForStorage.routes = this.FormatRoutesForStorage();
  if( this.topos ) cragForStorage.topos = this.FormatToposForStorage();
  return cragForStorage;
}

Crag.prototype.FormatRoutesForStorage = function() {
  if( !this.routes ) return [];
  return this.routes.map( route => {
    return {
      id: route.id,
      name: route.name,
      grade: route.grade
    };
  });
}

Crag.prototype.FormatToposForStorage = function() {
  if( !this.topos ) return [];
  return this.topos.map( topo => {
    const topoForStorage = {};
    if( topo.id ) topoForStorage.id = topo.id;
    if( topo.imageFile ) topoForStorage.imageFile = topo.imageFile;
    if( topo.routes ) topoForStorage.routes = this.FormatTopoRoutesForStorage(topo.routes);
    return topoForStorage;
  });
}

Crag.prototype.FormatTopoRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      points: this.FormatPointsForStorage(route.points)
    };
  });
}

Crag.prototype.FormatPointsForStorage = function(points) {
  if( !points ) return [];
  return points.map( point => {
    const pointToSave = {id: point.id};
    if( point.attachedTo ) {
      pointToSave.attachedTo = point.attachedTo.id;
    }
    else {
      pointToSave.x = point.x;
      pointToSave.y = point.y;
    }
    return pointToSave;
  });
}

module.exports = Crag;

},{"./route.cjs":27,"uuid":1}],22:[function(require,module,exports){
let DataStorage = function() {
  this.dataURL = null;
  this.saveDataURL = null;
}

DataStorage.prototype.Init = function(config, userID, userToken) {
  this.dataURL = config.data_url;
  this.saveDataURL = config.save_data_url;
  this.loadDataURL = config.load_data_url;
  this.userID = userID ? userID : "";
  this.userToken = userToken ? userToken : "";
}

DataStorage.prototype.Load = async function(object_id) {
  const response = await fetch(`${this.dataURL}${object_id}.json`, {cache: "reload"});
  return response.json();
}

DataStorage.prototype.LoadForUserEdit = async function(object_id) {
  const response = await fetch(`${this.loadDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}`);
  return response.json();
}

DataStorage.prototype.Save = async function(object_id, data) {
  const requestBody = JSON.stringify(data, null, 2);
  const url = `${this.saveDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response.json();
}

module.exports = new DataStorage;

},{}],23:[function(require,module,exports){
let ImageStorage = function() {
  this.imagesPath = null;
  this.loadImageURL = null;
  this.saveImageURL = null;
  this.userID = ""
  this.userToken = ""
}

ImageStorage.prototype.Init = function(config, userID, userToken) {
  this.imagesPath = `${config.images_url}`;
  this.loadImageURL = `${config.save_image_url}`;
  this.saveImageURL = `${config.save_image_url}`;
  this.userID = userID ? userID : "";
  this.userToken = userToken ? userToken : "";
}

ImageStorage.prototype.LoadImageFromFile = async function(filename) {
  const url = `${this.imagesPath}${filename}`;
  return new Promise( (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

ImageStorage.prototype.LoadImageFromAPI = async function(ID) {
  const url = `${this.loadImageURL}?id=${ID}`;
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  });
  const data = await response.text();
  return new Promise( (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = data;
  });
}

ImageStorage.prototype.SaveImageAndUpdateFilename = async function(ID, imageData, filenameObject) {
  const response = await this.SaveImage(ID, imageData);
  if( response.filename ) filenameObject.imageFile = response.filename;
  return response;
}

ImageStorage.prototype.SaveImage = async function(ID, imageData, type) {
  if( !type ) type = "topo";
  const url = `${this.saveImageURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${ID}&type=${type}`;
  console.log(url)
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(imageData)
  });

  return response.json();
}

module.exports = new ImageStorage;

},{}],24:[function(require,module,exports){
let PageHeader = function(element) {
  this.element = element;
}

PageHeader.prototype.AddIcon = function(fontAwesomeClass, title) {
  const icon = document.createElement("i");
  icon.classList.add("header-icon");
  icon.classList.add("fa-solid");
  icon.classList.add(fontAwesomeClass);
  icon.setAttribute("title",title)
  return this.element.appendChild(icon);
}

PageHeader.prototype.AddLogonIcon = function() {
  return this.AddIcon("fa-sign-in","Logon").onclick = () => window.location.href = "logon.html";
}

module.exports = PageHeader;

},{}],25:[function(require,module,exports){
let Point = function(point) {
  this.point = point;
}

Point.prototype.AttachTo = function(point) {
  if( this.point.id == point.id ) return;
  this.point.attachedTo = point;
  delete this.point.x;
  delete this.point.y;
}

module.exports = Point;

},{}],26:[function(require,module,exports){
const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;

let RouteTable = function(element, routes, editable, eventHandlerObject) {
  this.element = element;
  this.routes = routes;
  this.contentEditable = editable;
  this.eventHandlerObject = eventHandlerObject;
}

RouteTable.prototype.Refresh = function() {
  let tableBody = this.element.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = this.element.createTBody();
  while( this.element.rows.length > 0 ) this.element.deleteRow(0);
  this.routes.forEach( routeInfo => this.AppendRow(routeInfo) );
}

RouteTable.prototype.AppendRow = function(routeInfo) {
  let newRow = this.element.insertRow(this.element.rows.length);
  if( !routeInfo ) {
    newRow.insertCell(columnIndex_ID);
    newRow.insertCell(columnIndex_Index);
    newRow.insertCell(columnIndex_Name);
    newRow.insertCell(columnIndex_Grade);
    if( this.contentEditable ) this.EnableRowEdit(newRow);
    return newRow;
  }
  newRow.insertCell(columnIndex_ID).innerText = routeInfo.id;
  newRow.insertCell(columnIndex_Index).innerText = routeInfo ? this.element.rows.length : '#';
  newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
  newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
  if( this.contentEditable ) this.EnableRowEdit(newRow);
  return newRow;
}

RouteTable.prototype.GetRowID = function(row) {
  return row.cells[columnIndex_ID].innerText;
}

RouteTable.prototype.EnableRowEdit = function(row) {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let name = event.target.innerText;
    this.eventHandlerObject.OnRouteNameChanged(row, id, name);
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let grade = event.target.innerText;
    this.eventHandlerObject.OnRouteGradeChanged(row, id, grade);
  });
}

RouteTable.prototype.DisableCellMultilineEdit = function(cell) {
  cell.onkeydown = event => {
    if( event.keyCode == 13 ) {
      event.preventDefault();
      document.activeElement.blur();
    }
  }
}

module.exports = RouteTable;

},{}],27:[function(require,module,exports){
let uuid = require('uuid');
const Topo = require('./topo.cjs');

let Route = function(route) {
  if( !route ) this.route = {id:uuid.v4()};
  else this.route = route;
}

Route.prototype.AppendPoint = function(x, y) {
  if( !this.route.points ) this.route.points = [];
  const pointCount = this.route.points.push({id: uuid.v4(), x: x, y: y});
  return this.route.points[pointCount-1];
}

Route.prototype.GetResolvedPoints = function() {
  if( !this.route.points ) this.route.points = [];
  return this.route.points.map(point => {
      if( point.attachedTo ) {
        return point.attachedTo;
      }  
      return point;
    });
}

Route.prototype.GetJoinPoints = function() {
  if( !this.route.points || this.route.points.length < 3 ) return [];
  return this.route.points.filter( (point, index) => !point.attachedTo && index > 0 && index < this.route.points.length-1 );
}

module.exports = Route;

},{"./topo.cjs":32,"uuid":1}],28:[function(require,module,exports){
const TopoOverlay = require('./topo-overlay.cjs');
const Topo = require('./topo.cjs');
const Route = require('./route.cjs');
const Point = require('./point.cjs');

let TopoImage = function(canvas, editable) {
  this.canvas = canvas;
  this.image = null;
  this.topo = null;
  this.contentEditable = editable;
  this.routeID = null;
  this.mousePos = null;
  this.nearestPointInfo = null;
  this.dragStartPos = null;
  this.dragPointInfo = null;
  this.mouseDown = false;
  this.Clear();
}

TopoImage.prototype.Clear = function() {
  const ctx = this.canvas.getContext('2d');
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

TopoImage.prototype.Refresh = function() {
  if( !this.image ) {
    this.Clear();
    return;
  }

  if( this.image.height == 500 ) {
    this.canvas.setAttribute('width', this.image.width);
    this.canvas.setAttribute('height', this.image.height);  
  }
  else {
    this.canvas.height = 500;
    this.canvas.width = this.image.width * this.canvas.height / this.image.height;  
  }

  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  this.DrawOverlay();
}

TopoImage.prototype.DrawOverlay = function() {
  if( !this.topo ) return;

  const topoOverlay = new TopoOverlay(this.topo,this.contentEditable);
  topoOverlay.highlightedPoint = this.nearestPointInfo;
  topoOverlay.Draw(this.canvas);
}

TopoImage.prototype.AddMouseHandler = function() {
  this.canvas.onmousemove = event => this.OnMouseMove(event);
  this.canvas.onmousedown = event => this.OnMouseDown(event);
  this.canvas.onmouseup = event => this.OnMouseUp(event);
  this.canvas.onmouseleave = event => this.OnMouseLeave(event);
}

TopoImage.prototype.OnMouseMove = function(event) {
  this.mousePos = this.GetMousePositionFromEvent(event);
  if( this.mouseDown ) {
    if( this.dragPointInfo ) this.OnMouseDrag();
  }
  else {
    const topo = new Topo(this.topo);
    this.nearestPointInfo = topo.GetNearestPointWithin(this.mousePos.x, this.mousePos.y, 0.03);
  }
  this.Refresh();
}

TopoImage.prototype.OnMouseDrag = function() {
  this.dragPointInfo.x = this.mousePos.x;
  this.dragPointInfo.y = this.mousePos.y;
  const topo = new Topo(this.topo);
  this.nearestPointInfo = topo.GetNextNearestPointWithin(this.mousePos.x, this.mousePos.y, 0.03, this.dragPointInfo.id);
}

TopoImage.prototype.OnMouseDown = function(event) {
  this.mouseDown = true;
  this.dragStartPos = this.GetMousePositionFromEvent(event);
  this.dragPointInfo = this.nearestPointInfo;
}

TopoImage.prototype.OnMouseUp = function(event) {
  this.mouseDown = false;
  this.mousePos = this.GetMousePositionFromEvent(event);
  const topo = new Topo(this.topo);
  if( this.dragPointInfo && this.nearestPointInfo ) {
    const droppedPoint = new Point(this.dragPointInfo);
    droppedPoint.AttachTo(this.nearestPointInfo);
  }
  else if( this.dragPointInfo && !this.nearestPointInfo ) {
    this.dragPointInfo.x = this.mousePos.x;
    this.dragPointInfo.y = this.mousePos.y;
    this.dragPointInfo = null;
  }
  else {
    if( this.routeID ) {
      const route = new Route(topo.GetMatchingRoute(this.routeID));
      route.AppendPoint(this.mousePos.x, this.mousePos.y);
    }
  }
  this.Refresh();
}

TopoImage.prototype.OnMouseLeave = function(event) {
  this.mouseDown = false;
  this.Refresh();
}

TopoImage.prototype.GetMousePositionFromEvent = function(event) {
  let rect = this.canvas.getBoundingClientRect();
  let clientRectWidth = rect.right - rect.left;
  let clientRectHeight = rect.bottom - rect.top;
  let clientMouseX = event.clientX - rect.left;
  let clientMouseY = event.clientY - rect.top;
  let mousePercentX = clientMouseX / clientRectWidth;
  let mousePercentY = clientMouseY / clientRectHeight;
  return { x: mousePercentX, y: mousePercentY };
}

module.exports = TopoImage;

},{"./point.cjs":25,"./route.cjs":27,"./topo-overlay.cjs":30,"./topo.cjs":32}],29:[function(require,module,exports){
const Crag = require("./crag.cjs");
const { SaveImageAndUpdateFilename } = require("./image-storage.cjs");

let TopoMediaScroller = function(element, crag, edit, OnTopoSelectedCallback) {
  this.element = element;
  this.crag = crag;
  this.currentTopoContainer = null;
  this.edit = edit;
  this.topoImages = new Map();
  this.OnTopoSelectedCallback = OnTopoSelectedCallback;
  this.element.innerHTML = ''
}

TopoMediaScroller.prototype.LoadTopoImages = async function(imageStorage) {
  let cragTopoIDs = this.crag.topos.map( topo => topo.id );
  
  let topoImageContainers = cragTopoIDs.map( topoID => {
    return this.element.appendChild(this.CreateTopoImageContainer(topoID));
  });

  let topoImageCanvases = topoImageContainers.map( container => {
    let topoCanvas = document.createElement('canvas')
    topoCanvas.classList.add('topo-image');
    topoCanvas = container.appendChild(topoCanvas);
    topoCanvas.onclick = () => this.OnTopoSelected(container);
    return topoCanvas;
  });

  const topoImageLoaders = [];
  const crag = new Crag(this.crag);
  topoImageCanvases.forEach( async canvas => {
    let topoID = canvas.parentElement.dataset.id;
    let topo = crag.GetMatchingTopo(topoID);
    if( !topo ) return;

    if( topo.imageFile ) {
      try {
        let topoImageLoader = imageStorage.LoadImageFromFile(topo.imageFile);
        topoImageLoaders.push(topoImageLoader);
        let topoImage = await topoImageLoader;
        this.topoImages.set(topoID, topoImage);
        this.DisplayTopoImage(canvas, topoImage);
      }
      catch( e ) {
        console.error(e);
      }
    }
    else {
      try {
        let topoImageLoader = imageStorage.LoadImageFromAPI(topo.id);
        topoImageLoaders.push(topoImageLoader);
        let topoImage = await topoImageLoader;
        this.topoImages.set(topoID, topoImage);
        this.DisplayTopoImage(canvas, topoImage);
      }
      catch( e ) {
        console.error(e);
      }
    }
  });

  if( topoImageLoaders.length > 0 ) {
    await topoImageLoaders[0];
    this.OnTopoSelected(topoImageContainers[0]);
  }
}

TopoMediaScroller.prototype.AddTopo = function(topo) {
  const container = this.element.appendChild(this.CreateTopoImageContainer(topo.id));
  let canvas = document.createElement('canvas');
  canvas.classList.add('topo-image');
  canvas = container.appendChild(canvas);
  canvas.onclick = event => this.OnTopoSelected(event.target.parentElement);
  return canvas;
}

TopoMediaScroller.prototype.CreateTopoImageContainer = function(topoID) {
  let container = document.createElement('div');
  container.classList.add('topo-container');
  container.setAttribute('data-id', topoID);
  return container;
}

TopoMediaScroller.prototype.OnTopoSelected = function(topoContainer) {
  if( this.currentTopoContainer ) this.currentTopoContainer.classList.remove('topo-container-selected');
  this.currentTopoContainer = topoContainer;
  this.currentTopoContainer.classList.add('topo-container-selected');
  this.OnTopoSelectedCallback(this.currentTopoContainer.dataset.id, this.currentTopoContainer);
}

TopoMediaScroller.prototype.GetSelectedTopoID = function() {
  if( !this.currentTopoContainer ) return null;
  return this.currentTopoContainer.dataset.id;
}

TopoMediaScroller.prototype.GetSelectedTopoCanvas = function() {
  return this.currentTopoContainer.children[0]
};

TopoMediaScroller.prototype.DisplayTopoImage = function(topoCanvas, topoImage) {
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
  return topoCanvas;
}

TopoMediaScroller.prototype.UpdateSelectedTopoImage = function(image) {
  this.topoImages.set(this.GetSelectedTopoID(), image);
}

TopoMediaScroller.prototype.ShiftCurrentTopoLeft = function() {
  if( !this.currentTopoContainer ) return;
  const parentNode = this.currentTopoContainer.parentNode;
  const previousContainer = this.currentTopoContainer.previousSibling;
  this.currentTopoContainer.remove();
  parentNode.insertBefore(this.currentTopoContainer, previousContainer);
}

TopoMediaScroller.prototype.ShiftCurrentTopoRight = function() {
  if( !this.currentTopoContainer ) return;
  const parentNode = this.currentTopoContainer.parentNode;
  const nextContainer = this.currentTopoContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, this.currentTopoContainer);
}

module.exports = TopoMediaScroller;

},{"./crag.cjs":21,"./image-storage.cjs":23}],30:[function(require,module,exports){
const Route = require("./route.cjs");
const Topo = require("./topo.cjs");

const routeLineColor = "rgb(255, 255, 255)";
const routeStartPointColor = "rgb(40, 150, 40)";
const routeEndPointColor = "rgb(150, 20, 20)";
const routeJoinPointColor = "rgb(150, 150, 150)";

let TopoOverlay = function(topo, forEditor) {
  this.topo = topo;
  this.forEditor = forEditor;
  this.highlightedPoint = null;
}

TopoOverlay.prototype.Draw = function(canvas) {
  const ctx = canvas.getContext('2d');
  this.DrawRouteLines(ctx);
  this.DrawRouteStartPoints(ctx);
  this.DrawRouteEndPoints(ctx);
  if( this.forEditor ) this.DrawRouteJoinPoints(ctx);
  if( this.highlightedPoint ) this.HighlightPoint(ctx, this.highlightedPoint);
}

TopoOverlay.prototype.DrawRouteLines = function(ctx) {
  const topo = new Topo(this.topo);
  const topoLines = topo.GetRouteLines();

  const overlayLines = topoLines.map( line => {
    return {
      startX: line.startPoint.x * ctx.canvas.width,
      startY: line.startPoint.y * ctx.canvas.height,
      endX: line.endPoint.x * ctx.canvas.width,
      endY: line.endPoint.y * ctx.canvas.height
    };
  });

  overlayLines.forEach( line => {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.lineWidth = "4";
    ctx.strokeStyle = routeLineColor;
    ctx.stroke();
  });
}

TopoOverlay.prototype.DrawRouteStartPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const topoPoints = topo.GetSortedRouteStartPoints();
  
  const indexedPoints = topoPoints.map( (point, index) => {
    return {
      point: point,
      index: index
    }
  });

  const startCounts = new Map();
  indexedPoints.forEach( point => {
    let count = startCounts.get(point.point.id);
    if( !count ) count = 0;
    this.DrawRouteStartPoint(ctx, point.point, point.index, count);
    startCounts.set(point.point.id, count + 1);
  });
}

TopoOverlay.prototype.DrawRouteEndPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const points = topo.GetSortedRouteEndPoints();
  
  const indexedPoints = points.map( (point, index) => {
    return {
      point: point,
      index: index
    }
  });

  const endCounts = new Map();
  indexedPoints.forEach( point => {
    let count = endCounts.get(point.point.id);
    if( !count ) count = 0;
    this.DrawRouteEndPoint(ctx, point.point, point.index, count);
    endCounts.set(point.point.id, count + 1);
  });
}

TopoOverlay.prototype.DrawRouteJoinPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const routes = topo.GetSortedRoutes();
  routes.forEach( (routeData, index) => {
    const route = new Route(routeData);
    const points = route.GetJoinPoints();
    points.forEach( point => this.DrawRouteJoinPoint(ctx, point, index+1) );
  });
}

TopoOverlay.prototype.DrawRouteStartPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y + number * 0.04, index + 1, routeStartPointColor);
}

TopoOverlay.prototype.DrawRouteEndPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y - number * 0.04, index + 1, routeEndPointColor);
}

TopoOverlay.prototype.DrawRouteJoinPoint = function(ctx, point, index) {
  this.DrawPoint(ctx, point.x, point.y, index, routeJoinPointColor);
}

TopoOverlay.prototype.DrawPoint = function(ctx, x, y, text, color) {
  x = x * ctx.canvas.width;
  y = y * ctx.canvas.height;
  const fontSize = 1;
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText(text);
  let widthOfText = metrics.width;
  let radiusOfPoint = widthOfText * 1.2;
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.arc(x, y, radiusOfPoint, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, radiusOfPoint, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.fillStyle = "rgb(230,230,230)";
  ctx.fillText(text, x - (widthOfText * 0.5), y + (widthOfText * 0.6));
  return radiusOfPoint * 2;
}

TopoOverlay.prototype.HighlightPoint = function(ctx, point) {
  const fontSize = 1;
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText('X');
  let widthOfRouteIndex = metrics.width;
  ctx.beginPath();
  ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, widthOfRouteIndex * 1.2, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize * 3;
  ctx.strokeStyle = "rgb(250, 250, 250)";
  ctx.stroke();
}

module.exports = TopoOverlay;

},{"./route.cjs":27,"./topo.cjs":32}],31:[function(require,module,exports){
const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

const columnIndex_Button = 4;

let TopoRouteTable = function(element, topoData, OnRouteSelectedCallback) {
  this.element = element;
  this.topo = new Topo(topoData);
  this.OnRouteSelectedCallback = OnRouteSelectedCallback;
  this.Refresh();
}

TopoRouteTable.prototype.Refresh = function() {
  this.routeInfo = this.topo.GetSortedRouteInfo();
  this.table = new RouteTable(this.element, this.routeInfo);
  this.selectedRow = null;
  this.selectedRouteID = null;
  this.selectedRoute = null;
  
  this.table.Refresh();
  
  if( this.OnRouteSelectedCallback ) {
    Array.from(this.table.element.rows).forEach( row => {
      row.insertCell(columnIndex_Button);
      row.onclick = event => {
        this.OnRowClick(event.target.parentElement);
      }
    });
  }
}

TopoRouteTable.prototype.OnRowClick = function(rowElement) {
  if( this.selectedRow ) {
    let buttonCell = this.selectedRow.cells[columnIndex_Button];
    buttonCell.classList.remove('fa');
    buttonCell.classList.remove('fa-edit');
  }
  this.selectedRow = rowElement;
  let buttonCell = this.selectedRow.cells[columnIndex_Button];
  buttonCell.classList.add('fa');
  buttonCell.classList.add('fa-edit');
  this.selectedRouteID = this.table.GetRowID(this.selectedRow);
  this.selectedRoute = this.topo.GetMatchingRoute(this.selectedRouteID);
  if( this.OnRouteSelectedCallback ) this.OnRouteSelectedCallback(this.selectedRoute);
}

module.exports = TopoRouteTable;

},{"./route-table.cjs":26,"./topo.cjs":32}],32:[function(require,module,exports){
let uuid = require('uuid');

let Topo = function(topo) {
  if( !topo ) this.topo = {id:uuid.v4()};
  else this.topo = topo;
}

Topo.prototype.GetMatchingRoute = function(id) {
  if( !this.topo.routes ) return null;
  let matchingRoutes = this.topo.routes.filter(route => route.id === id);
  if( matchingRoutes.length != 1 ) return null;
  return matchingRoutes[0];
}

Topo.prototype.GetNearestPointWithin = function(x, y, within) {
  if( !this.topo.routes || this.topo.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.topo.routes.map( route => GetNearestPointForRoute(x, y, route) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  if( !nearestPoint ) return null;
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.GetNextNearestPointWithin = function(x, y, within, exludedPointID) {
  if( !this.topo.routes || this.topo.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.topo.routes.map( route => GetNextNearestPointForRoute(x, y, route, exludedPointID) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  if( !nearestPoint ) return null;
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.GetSortedRoutes = function() {
  if( !this.topo.routes ) return [];
  const routes = this.topo.routes.map(route=>route);
  return routes.sort( (route1, route2) => this.CalculateSortOrder(route1, route2) );
}

Topo.prototype.CalculateSortOrder = function(route1, route2) {
  const route1Start = this.GetRouteStartPoint(route1);
  const route2Start = this.GetRouteStartPoint(route2);

  if( !route1Start && !route2Start ) return 0;
  if( !route2Start ) return -1;
  if( !route1Start ) return 1;

  const route1End = this.GetRouteEndPoint(route1);
  const route2End = this.GetRouteEndPoint(route2);

  if( route1Start.x < route2Start.x ) return -1;
  if( route2Start.x < route1Start.x ) return 1;

  if( !route1End && !route2End ) return 0;
  if( !route2End ) return -1;
  if( !route1End ) return 1;

  if( route1End.x < route2End.x ) return -1;
  if( route2End.x < route1End.x ) return 1;

  return 0;
}

Topo.prototype.GetRouteStartPoint = function(route) {
  if( !route.points || route.points.length == 0 ) return null;
  if( route.points[0].attachedTo ) {
    const attachedToRoute = this.GetRouteContainingPoint(route.points[0].attachedTo);
    return this.GetRouteStartPoint(attachedToRoute);
  }
  return route.points[0];
}

Topo.prototype.GetRouteEndPoint = function(route) {
  if( !route.points || route.points.length < 2 ) return null;
  const lastPointIndex = route.points.length - 1;
  if( route.points[lastPointIndex].attachedTo ) {
    const attachedToRoute = this.GetRouteContainingPoint(route.points[lastPointIndex].attachedTo);
    return this.GetRouteEndPoint(attachedToRoute);
  }
  return route.points[lastPointIndex];
}

Topo.prototype.GetRouteContainingPoint = function(pointToFind) {
  const matchingRoutes = this.topo.routes.filter( route => {
    if( !route.points ) return false;
    const matchingPoints = route.points.filter( point => point == pointToFind );
    return matchingPoints.length > 0;
  });
  if( matchingRoutes.length == 0 ) return null;
  return matchingRoutes[0];
}

Topo.prototype.GetSortedRouteInfo = function() {
  const routeInfo = [];
  const routes = this.GetSortedRoutes();
  routes.forEach(route => {
    routeInfo.push({id:route.info.id,name:route.info.name,grade:route.info.grade});
  });
  return routeInfo;
}

Topo.prototype.AppendRoute = function(route) {
  if( !this.topo.routes ) this.topo.routes = [];
  this.topo.routes.push({id:route.id,info:route})
}

Topo.prototype.RemoveMatchingRoute = function(id) {
  const remainingRoutes = this.topo.routes.filter( route => route.id != id );
  this.topo.routes = remainingRoutes;
}

Topo.prototype.GetRouteLines = function() {
  if( !this.topo.routes ) return [];
  const lines = [];
  this.topo.routes.forEach( route => {
    if( route.points ) {
      const points = route.points.map( point => point.attachedTo ? point.attachedTo : point );
      points.forEach( (point, index, points) => {
        const nextPoint = points[index + 1];
        if( nextPoint ) lines.push({startPoint:point, endPoint:nextPoint});
      });
    }
  });
  return lines;
}

Topo.prototype.GetSortedRouteStartPoints = function() {
  const sortedRoutes = this.GetSortedRoutes();
  return sortedRoutes.map( route => this.GetRouteStartPoint(route) )
  .filter( point => point );
}

Topo.prototype.GetSortedRouteEndPoints = function() {
  const sortedRoutes = this.GetSortedRoutes();
  return sortedRoutes.map( route => this.GetRouteEndPoint(route) )
  .filter( point => point );
}

module.exports = Topo;

let GetNearestPointForRoute = (x, y, route) => GetNextNearestPointForRoute(x, y, route, null);

let GetNextNearestPointForRoute = (x, y, route, excludedPointID) => {
  if( !route.points ) return null;
  const includedPoints = route.points.filter( point => point.id !== excludedPointID );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, includedPoints);
  if( nearestPoint ) nearestPoint.parent = route;
  return nearestPoint;
}

let GetNearestPointForArrayOfPoints = (x, y, points) => {
  const unattachedPoints = points.filter( point => !point.attachedTo );
  let nearestPoint = unattachedPoints.reduce( (previousResult, currentPoint) => {
    if( !previousResult.point ) return {point: currentPoint, distance: GetDistanceBetweenPoints(currentPoint.x, currentPoint.y, x, y)};
    const currentResult = {point: currentPoint, distance: GetDistanceBetweenPoints(currentPoint.x, currentPoint.y, x, y)};
    return previousResult.distance < currentResult.distance ? previousResult : currentResult;
  }, {});

  return nearestPoint.point;
}

let GetDistanceBetweenPoints = (x1, y1, x2, y2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt( dx*dx + dy*dy );
}

},{"uuid":1}]},{},[16]);
