'use strict';
const env = typeof self === 'object' ? self : globalThis;

const _deserialize = (index, $, _) => {
  if ($.has(index))
    return $.get(index);

  const [type, value] = _[index];

  const as = deserialized => {
    $.set(index, deserialized);
    return deserialized;
  };

  switch (type) {
    case 'primitive':
      return as(value);
    case 'Array': {
      const arr = as([]);
      for (const index of value)
        arr.push(_deserialize(index, $, _));
      return arr;
    }
    case 'Object': {
      const object = as({});
      for (const [key, index] of value)
        object[key] = _deserialize(index, $, _);
      return object;
    }
    case 'Date':
      return as(new Date(value));
    case 'RegExp': {
      const {source, flags} = value;
      return as(new RegExp(source, flags));
    }
    case 'Map': {
      const map = as(new Map);
      for (const [key, index] of value)
        map.set(key, _deserialize(index, $, _));
      return map;
    }
    case 'Set': {
      const set = as(new Set);
      for (const index of value)
        set.add(_deserialize(index, $, _));
      return set;
    }
    case 'Error': {
      const {name, message} = value;
      return as(new env[name](message));
    }
    case 'Boolean':
      return as(new Boolean(value));
    case 'Number':
      return as(new Number(value));
    case 'String':
      return as(new String(value));
    case 'BigInt':
      return as(BigInt(value));
  }
  return as(new env[type](value));
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = serialized => _deserialize(0, new Map, serialized);
exports.deserialize = deserialize;
