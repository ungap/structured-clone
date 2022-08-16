import { b64decode, b64encode } from './b64.js'
import {
  VOID, PRIMITIVE,
  ARRAY, OBJECT, BUFFER,
  DATE, REGEXP, MAP, SET,
  ERROR, BIGINT
} from './types.js';

const env = typeof self === 'object' ? self : globalThis;
const TypedArray = Reflect.getPrototypeOf(Uint8Array)

const deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };

  const unpair = index => {
    if ($.has(index))
      return $.get(index);

    const [type, value, arg2, arg3] = _[index];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index);
      case BUFFER: {
        const buf = b64decode(unpair(value)).buffer
        return as(buf, index);
      }
      case ARRAY: {
        const arr = as([], index);
        for (const index of value)
          arr.push(unpair(index));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index);
        for (const [key, index] of value)
          object[unpair(key)] = unpair(index);
        return object;
      }
      case DATE:
        return as(new Date(value), index);
      case REGEXP: {
        const {source, flags} = value;
        return as(new RegExp(source, flags), index);
      }
      case MAP: {
        const map = as(new Map, index);
        for (const [key, index] of value)
          map.set(unpair(key), unpair(index));
        return map;
      }
      case SET: {
        const set = as(new Set, index);
        for (const index of value)
          set.add(unpair(index));
        return set;
      }
      case ERROR: {
        const {name, message} = value;
        return as(new env[name](message), index);
      }
      case BIGINT:
        return as(BigInt(value), index);
      case 'BigInt':
        return as(Object(BigInt(value)), index);
    }
    if (Reflect.getPrototypeOf(env[type]) === TypedArray) {
      const ab = unpair(value);
      return as(new env[type](ab, arg2, arg3), index);
    }
    return as(new env[type](value), index);
  };

  return unpair;
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
export const deserialize = serialized => deserializer(new Map, serialized)(0);
