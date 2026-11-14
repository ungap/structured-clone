const assert = require('node:assert/strict');
const {serialize, deserialize, default: clone} = require('../cjs');
const {parse, stringify} = require('../cjs/json');

for (const roundTrip of [
  value => deserialize(serialize(value)),
  value => parse(stringify(value)),
  value => clone(value, {lossy: false})
]) {
  for (const Class of [Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError]) {
    const original = new Class('outer', {cause: new TypeError('inner')});
    const native = globalThis.structuredClone(original);
    const actual = roundTrip(original);
    assert.equal(actual.constructor, native.constructor);
    assert.equal(actual.cause.constructor, native.cause.constructor);
    assert.equal(actual.cause.message, native.cause.message);
    assert.deepEqual(Object.getOwnPropertyDescriptor(actual, 'cause'), {
      value: actual.cause, enumerable: false, configurable: true, writable: true
    });
  }

  for (const cause of [undefined, null, false, 0, '', 'reason', 1n, {status: 500}]) {
    const actual = roundTrip(new Error('outer', {cause}));
    assert.equal(Object.hasOwn(actual, 'cause'), true);
    assert.deepEqual(actual.cause, cause);
  }

  const shared = {status: 500};
  const actual = roundTrip({error: new Error('outer', {cause: shared}), shared});
  assert.equal(actual.error.cause, actual.shared);

  const self = new Error('self');
  self.cause = self;
  const selfClone = roundTrip(self);
  assert.equal(selfClone.cause, selfClone);

  const first = new Error('first');
  const second = new TypeError('second', {cause: first});
  first.cause = second;
  const cycle = roundTrip(first);
  assert.equal(cycle.cause.cause, cycle);
  assert.equal(cycle.cause.message, 'second');

  const inherited = new Error('inherited');
  Object.setPrototypeOf(inherited, Object.create(Error.prototype, {
    cause: {value: 'inherited cause'}
  }));
  assert.equal(Object.hasOwn(roundTrip(inherited), 'cause'), false);

  let reads = 0;
  const getter = new Error('getter');
  Object.defineProperty(getter, 'cause', {get() { reads++; return shared; }});
  const nativeGetter = globalThis.structuredClone(getter);
  const actualGetter = roundTrip(getter);
  assert.equal(Object.hasOwn(actualGetter, 'cause'), Object.hasOwn(nativeGetter, 'cause'));
  assert.equal(reads, 0);

  const throwing = new Error('throwing getter');
  Object.defineProperty(throwing, 'cause', {get() { throw new Error('must not run'); }});
  assert.equal(Object.hasOwn(roundTrip(throwing), 'cause'), false);
  assert.equal(Object.hasOwn(globalThis.structuredClone(throwing), 'cause'), false);
}

for (const cause of [() => {}, Symbol('reason')]) {
  const error = new Error('outer', {cause});
  assert.throws(() => serialize(error), TypeError);
  assert.equal(Object.hasOwn(deserialize(serialize(error, {lossy: true})), 'cause'), false);
  assert.equal(Object.hasOwn(parse(stringify(error)), 'cause'), false);
}

const legacy = [[7, {name: 'Error', message: 'legacy'}]];
assert.equal(deserialize(legacy).message, 'legacy');
assert.equal(Object.hasOwn(deserialize(legacy), 'cause'), false);
assert.deepEqual(serialize(new Error('legacy')), legacy);
