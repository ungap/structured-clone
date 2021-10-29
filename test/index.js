const {serialize, deserialize, default: structuredClone} = require('../cjs');

const obj = {
  arr: [],
  bigint: 1n,
  boolean: true,
  number: 123,
  string: '',
  undefined: void 0,
  null: null,
  int: new Uint32Array([1, 2, 3]),
  map: new Map([['a', 123]]),
  set: new Set(['a', 'b']),
  Bool: new Boolean(false),
  Num: new Number(0),
  Str: new String(''),
  date: new Date,
  re: new RegExp('', 'gim'),
  error: new Error('test')
};
obj.arr.push(obj, obj, obj);
const serialized = serialize(obj);

// console.log(serialized);

// for code coverage sake
try {
  serialize(function () {});
  process.exit(1);
}
catch (ok) {}

try {
  class Shenanigans {
    get [Symbol.toStringTag]() {
      return 'Shenanigans';
    }
  }
  serialize(new Shenanigans);
  process.exit(1);
}
catch (ok) {}

const deserialized = deserialize(serialized);

console.assert(deserialized.arr[0] === deserialized);

console.time('cloned in');
structuredClone(obj);
console.timeEnd('cloned in');
