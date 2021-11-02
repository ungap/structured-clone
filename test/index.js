let {serialize, deserialize, default: structuredClone} = require('../cjs');

const assert = (expected, result, message = '') => {
  if (!Object.is(expected, result)) {
    console.error(message || `expected ${expected}\ngot ${result}`);
    process.exit(1);
  }
};

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
    `[[2,[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[20,21],[23,24],[25,26],[27,28],[29,30],[31,32],[33,34],[35,36]]],[0,"arr"],[1,[0,0,0]],[0,"bigint"],[8,"1"],[0,"boolean"],[0,true],[0,"number"],[0,123],[0,"string"],[0,""],[0,"undefined"],[0,null],[0,"null"],[0,null],[0,"int"],["Uint32Array",[1,2,3]],[0,"map"],[5,[[19,8]]],[0,"a"],[0,"set"],[6,[19,22]],[0,"b"],[0,"Bool"],["Boolean",false],[0,"Num"],["Number",0],[0,"Str"],["String",""],[0,"re"],[4,{"source":"test","flags":"gim"}],[0,"error"],[7,{"name":"Error","message":"test"}],[0,"BI"],["BigInt","1"],[0,"date"],[3,"${date.toISOString()}"]]`
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
