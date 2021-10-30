'use strict';
const {
  PRIMITIVE, ARRAY, OBJECT, DATE, REGEXP, MAP, SET, ERROR, BIGINT
} = require('./types.js');

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
    case PRIMITIVE:
      return as(value);
    case ARRAY: {
      const arr = as([]);
      for (const index of value)
        arr.push(_deserialize(index, $, _));
      return arr;
    }
    case OBJECT: {
      const object = as({});
      for (const [key, index] of value)
        object[_deserialize(key, $, _)] = _deserialize(index, $, _);
      return object;
    }
    case DATE:
      return as(new Date(value));
    case REGEXP: {
      const {source, flags} = value;
      return as(new RegExp(source, flags));
    }
    case MAP: {
      const map = as(new Map);
      for (const [key, index] of value)
        map.set(_deserialize(key, $, _), _deserialize(index, $, _));
      return map;
    }
    case SET: {
      const set = as(new Set);
      for (const index of value)
        set.add(_deserialize(index, $, _));
      return set;
    }
    case ERROR: {
      const {name, message} = value;
      return as(new env[name](message));
    }
    case BIGINT:
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
