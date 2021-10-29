let {serialize, deserialize, default: structuredClone} = require('../cjs');

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

// warming JIT
test(true);
test();

// for code coverage sake (globalThis VS self)
delete require.cache[require.resolve('../cjs')];
delete require.cache[require.resolve('../cjs/deserialize.js')];
globalThis.self = globalThis;
require('../cjs');

({serialize, deserialize, default: structuredClone} = require('../cjs'));
test();
test();

function test(firstRun = false) {

  console.log(`\x1b[1m${firstRun ? 'cold' : 'warm'}\x1b[0m`);
  console.time('serialized in');
  const serialized = serialize(obj);
  console.timeEnd('serialized in');
  console.time('deserialized in');
  const deserialized = deserialize(serialized);
  console.timeEnd('deserialized in');
  console.assert(deserialized.arr[0] === deserialized);

  // for code coverage sake
  if (firstRun) {
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
  }

  console.time('cloned in');
  structuredClone(obj);
  console.timeEnd('cloned in');
  console.log('');
}
