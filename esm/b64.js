var U = Uint8Array,
r = (x, y, o = []) => {for(;x<=y;)o.push(x++);return o},
f = [...r(65, 90), ...r(97, 122), ...r(48, 57), 45, 95, 61],
h = [
  ...Array(43).fill(0), 62, 0, 62, 0, 63, ...r(52, 61), 0, 0, 0,
  64, 0, 0, 0, ...r(0, 25), 0, 0, 0, 0, 63, 0, ...r(26, 51), 0, 0
]

/**
 * convert base64 string to Uint8Array
 * @param {string} a
 */
export function b64decode(a) {
  for (var _=a.charCodeAt.bind(a), b = a.length, f = '=' === a[b - 2] ? 2 : '=' === a[b - 1] ? 1 : 0, d = new U((.75 * a.length  + 0.5|0) - f), e = 0, g = b - f & 4294967292, c = 0; c < g; c += 4) b = h[_(c)] << 18 | h[_(c + 1)] << 12 | h[_(c + 2)] << 6 | h[_(c + 3)], d[e++] = b >> 16 & 255, d[e++] = b >> 8 & 255, d[e++] = b & 255;
  1 === f && (b = h[_(c)] << 10 | h[_(c + 1)] << 4 | h[_(c + 2)] >> 2, d[e++] = b >> 8 & 255, d[e++] = b & 255);
  2 === f && (b = h[_(c)] << 2 | h[_(c + 1)] >> 4, d[e++] = b & 255);
  console.log(d)
  return d
};

/**
 * convert Uint8Array to base64 string
 * @param {Uint8Array} x
 */
export const b64encode = x => {
  for (var b = -1, h = x.length, d = new U(Math.ceil(4 * h / 3)), e = 0; ++b < h;) {
    var c = x[b],
      g = x[++b];
    d[e++] = f[c >> 2];
    d[e++] = f[(c & 3) << 4 | g >> 4];
    isNaN(g)
      ? (d[e++] = f[64], d[e++] = f[64])
      : (
        c = x[++b],
        d[e++] = f[(g & 15) << 2 | c >> 6],
        d[e++] = f[isNaN(c) ? 64 : c & 63]
      )
  }
  const str = new TextDecoder().decode(d)
  return str + (str.length % 3 === 2 ? '=' : str.length % 3 === 1 ? '==' : '')
}
