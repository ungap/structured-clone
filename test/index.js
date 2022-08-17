let {serialize, deserialize, default: structuredClone} = require('../cjs');
let {stringify, parse} = require('../cjs/json');

const assert = (expected, result, message = '') => {
  if (!Object.is(expected, result)) {
    console.error(message || `expected ${expected}\ngot      ${result}`);
    process.exit(1);
  }
};

// @see https://github.com/ungap/structured-clone/issues/4
const withUndefined = stringify({foo: 'test', bar: undefined, foobar: null});
assert(withUndefined, '[[2,[[1,2],[3,4],[5,6]]],[0,"foo"],[0,"test"],[0,"bar"],[-1],[0,"foobar"],[0,null]]');
assert(Object.keys(parse(withUndefined)).join(','), 'foo,bar,foobar');
assert(parse(withUndefined).bar, void 0);

const date = new Date;

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
  re: new RegExp('test', 'gim'),
  error: new Error('test'),
  BI: Object(1n),
  date
};

obj.arr.push(obj, obj, obj);

// warming JIT
test(true);
test();

// for code coverage sake (globalThis VS self)
delete require.cache[require.resolve('../cjs')];
delete require.cache[require.resolve('../cjs/deserialize.js')];
globalThis.self = globalThis;
if (!globalThis.structuredClone)
  globalThis.structuredClone = (...args) => deserialize(serialize(...args));
require('../cjs');

({serialize, deserialize, default: structuredClone} = require('../cjs'));
test();
test();

function test(firstRun = false) {

  console.log(`\x1b[1m${firstRun ? 'cold' : 'warm'}\x1b[0m`);
  console.time('serialized in');
  const serialized = serialize(obj);
  console.timeEnd('serialized in');

  assert(JSON.stringify(serialized), [
    `[[2,[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[19,20],[22,23],[25,26],[27,28],[29,30],[31,32],[33,34],[35,36],[37,38]]],[0,"arr"],[1,[0,0,0]],[0,"bigint"],[8,"1"],[0,"boolean"],[0,true],[0,"number"],[0,123],[0,"string"],[0,""],[0,"undefined"],[-1],[0,"null"],[0,null],[0,"int"],["Uint32Array",18,0,3],[0,"AQAAAAIAAAADAAAA=="],[9,17],[0,"map"],[5,[[21,8]]],[0,"a"],[0,"set"],[6,[21,24]],[0,"b"],[0,"Bool"],["Boolean",false],[0,"Num"],["Number",0],[0,"Str"],["String",""],[0,"re"],[4,{"source":"test","flags":"gim"}],[0,"error"],[7,{"name":"Error","message":"test"}],[0,"BI"],["BigInt","1"],[0,"date"],[3,"${date.toISOString()}"]]`
  ].join(','));

  // firstRun && console.log(serialized);

  console.time('deserialized in');
  const deserialized = deserialize(serialized);
  console.timeEnd('deserialized in');

  assert(deserialized.arr.length, 3);
  assert(deserialized.arr[0], deserialized);
  assert(deserialized.arr[1], deserialized);
  assert(deserialized.arr[2], deserialized);
  assert(deserialized.bigint, 1n);
  assert(deserialized.boolean, true);
  assert(deserialized.number, 123);
  assert(deserialized.string, '');
  assert(deserialized.undefined, void 0);
  assert(deserialized.null, null);
  assert(deserialized.int instanceof Uint32Array, true);
  assert(deserialized.int.length, 3);
  assert(deserialized.int[0], 1);
  assert(deserialized.int[1], 2);
  assert(deserialized.int[2], 3);
  assert(deserialized.map.size, 1);
  assert(deserialized.map.get('a'), 123);
  assert(deserialized.set.size, 2);
  assert([...deserialized.set].join(','), 'a,b');
  assert(deserialized.Bool instanceof Boolean, true);
  assert(deserialized.Bool.valueOf(), false);
  assert(deserialized.Num instanceof Number, true);
  assert(deserialized.Num.valueOf(), 0);
  assert(deserialized.Str instanceof String, true);
  assert(deserialized.Str.valueOf(), '');
  assert(deserialized.re instanceof RegExp, true);
  assert(deserialized.re.source, 'test');
  assert(deserialized.re.flags, 'gim');
  assert(deserialized.error instanceof Error, true);
  assert(deserialized.error.message, 'test');
  assert(deserialized.BI instanceof BigInt, true);
  assert(deserialized.BI.valueOf(), 1n);
  assert(deserialized.date instanceof Date, true);
  assert(deserialized.date.toISOString(), date.toISOString());

  const arrayBuffer = new Uint8Array([3,4,5]).buffer
  const ser = serialize([
    new Uint8Array([3,4,5]).buffer,
    new Uint8Array([3,4,5]).buffer,
    arrayBuffer,
    arrayBuffer,
    new Uint8Array(arrayBuffer, 1, 1)
  ])
  const dec = deserialize(ser)
  assert(new Uint8Array(dec[0]).join() === '3,4,5', 'buff still intact');
  assert(dec[0] !== dec[1], 'buf 0 & 1 should be different ArrayBuffer');
  assert(dec[2] === dec[3], 'buf 2 & 3 should be the same ArrayBuffer');
  assert(dec[2].buffer === dec[3], 'buf 3 & subArr should be the same ArrayBuffer');

  // for code coverage sake
  if (firstRun) {
    try {
      serialize(function () {});
      process.exit(1);
    }
    catch (ok) {}
  }

  console.time('cloned in');
  structuredClone(obj);
  console.timeEnd('cloned in');
  console.log('');
}

const lossy = structuredClone(
  [
    1,
    function () {},
    new Map([['key', Symbol()]]),
    new Set([Symbol()]),
    {
      test() {},
      sym: Symbol()
    },
    {
      toJSON() {
        return 'OK';
      }
    }
  ],
  {json: true}
);

assert(lossy[0], 1);
assert(lossy[1], null);
assert(lossy[2].size, 0);
assert(lossy[3].size, 0);
assert(JSON.stringify(lossy[4]), '{}');
assert(lossy[5], 'OK');

const lossy2 = parse(stringify(lossy));
assert(lossy2[0], 1);
assert(lossy2[1], null);
assert(lossy2[2].size, 0);
assert(lossy2[3].size, 0);
assert(JSON.stringify(lossy2[4]), '{}');
assert(lossy2[5], 'OK');
