'use strict';
function range (start, end, result = []) {
  for (;start <= end;) {
    result.push(start++);
  }
  return result;
}

const encodingTable = [
  ...range(65, 90),
  ...range(97, 122),
  ...range(48, 57), 45, 95, 61
];

const decodingTable = [
  ...Array(43).fill(0), 62, 0, 62, 0, 63,
  ...range(52, 61), 0, 0, 0, 64, 0, 0, 0,
  ...range(0, 25), 0, 0, 0, 0, 63, 0,
  ...range(26, 51), 0, 0
];

/**
 * convert base64 string to Uint8Array
 * @param {string} base64String
 */
function b64decode(base64String) {
  const code = base64String.charCodeAt.bind(base64String);
  const sourceLength = base64String.length;
  const paddingLength = base64String[sourceLength - 2] === '='
    ? 2 : base64String[sourceLength - 1] === '='
    ? 1 : 0;
  let i = base64String.length;
  const uint8 = new Uint8Array((.75 * i + 0.5|0) - paddingLength);

  for (var e = 0, g = i - paddingLength & 4294967292, c = 0; c < g; c += 4) {
    i = decodingTable[code(c)] << 18 |
        decodingTable[code(c + 1)] << 12 |
        decodingTable[code(c + 2)] << 6 |
        decodingTable[code(c + 3)];

    uint8[e++] = i >> 16 & 255;
    uint8[e++] = i >> 8 & 255;
    uint8[e++] = i & 255;
  }

  if (paddingLength === 1) {
    i = decodingTable[code(c)] << 10 |
    decodingTable[code(c + 1)] << 4 |
    decodingTable[code(c + 2)] >> 2;

    uint8[e++] = i >> 8 & 255, uint8[e++] = i & 255;
  }

  if (paddingLength === 2) {
    i = decodingTable[code(c)] << 2 | decodingTable[code(c + 1)] >> 4,
    uint8[e++] = i & 255;
  };

  return uint8;
}
exports.b64decode = b64decode

/**
 * convert Uint8Array to base64 string
 * @param {Uint8Array} uint8array
 */
function b64encode(uint8array) {
  const len = uint8array.length;
  const data = new Uint8Array(Math.ceil(4 * len / 3));

  for (var i = -1, e = 0; ++i < len;) {
    let code = uint8array[i];
    const g = uint8array[++i];
    data[e++] = encodingTable[code >> 2];
    data[e++] = encodingTable[(code & 3) << 4 | g >> 4];

    if (isNaN(g)) {
      data[e++] = encodingTable[64],
      data[e++] = encodingTable[64]
    } else {
      code = uint8array[++i],
      data[e++] = encodingTable[(g & 15) << 2 | code >> 6],
      data[e++] = encodingTable[isNaN(code) ? 64 : code & 63]
    }
  }

  const str = new TextDecoder().decode(data);
  return str + (str.length % 3 === 2 ? '=' : str.length % 3 === 1 ? '==' : '');
}
exports.b64encode = b64encode
