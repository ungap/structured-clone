'use strict';
const {
  PRIMITIVE, ARRAY, OBJECT, DATE, REGEXP, MAP, SET, ERROR, BIGINT
} = require('./types.js');

const EMPTY = '';

const {toString} = {};
const {keys} = Object;

const typeOf = value => {
  const type = typeof value;
  if (type !== 'object' || !value)
    return [PRIMITIVE, type];

  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case 'Array':
      return [ARRAY, EMPTY];
    case 'Object':
      return [OBJECT, EMPTY];
    case 'Date':
      return [DATE, EMPTY];
    case 'RegExp':
      return [REGEXP, EMPTY];
    case 'Map':
      return [MAP, EMPTY];
    case 'Set':
      return [SET, EMPTY];
  }

  if (asString.includes('Array'))
    return [ARRAY, asString];

  if (asString.includes('Error'))
    return [ERROR, asString];

  return [OBJECT, asString];
};

const shouldSkip = ([TYPE, type]) => (
  TYPE === PRIMITIVE &&
  (type === 'function' || type === 'symbol')
);

const as = (out, value, $, _) => {
  const index = _.push(out) - 1;
  $.set(value, index);
  return index;
};

const pair = (lossy, value, $, _) => {
  if ($.has(value))
    return $.get(value);

  let [TYPE, type] = typeOf(value);
  switch (TYPE) {
    case PRIMITIVE: {
      let entry = value;
      switch (type) {
        case 'bigint':
          TYPE = BIGINT;
          entry = value.toString();
          break;
        case 'function':
        case 'symbol':
          if (!lossy)
            throw new TypeError('unable to serialize ' + type);
          entry = null;
          break;
      }
      return as([TYPE, entry], value, $, _);
    }
    case ARRAY: {
      if (type)
        return as([type, [...value]], value, $, _);

      const arr = [];
      const index = as([TYPE, arr], value, $, _);
      for (const entry of value)
        arr.push(pair(lossy, entry, $, _));
      return index;
    }
    case OBJECT: {
      if (type) {
        switch (type) {
          case 'BigInt':
            return as([type, value.toString()], value, $, _);
          case 'Boolean':
          case 'Number':
          case 'String':
            return as([type, value.valueOf()], value, $, _);
        }
      }

      const entries = [];
      const index = as([TYPE, entries], value, $, _);
      for (const key of keys(value)) {
        if (lossy && shouldSkip(typeOf(value[key])))
          continue;

        entries.push([
          pair(lossy, key, $, _),
          pair(lossy, value[key], $, _)
        ]);
      }
      return index;
    }
    case DATE:
      return as([TYPE, value.toISOString()], value, $, _);
    case REGEXP: {
      const {source, flags} = value;
      return as([TYPE, {source, flags}], value, $, _);
    }
    case MAP: {
      const entries = [];
      const index = as([TYPE, entries], value, $, _);
      for (const [key, entry] of value) {
        if (lossy && (shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
          continue;

        entries.push([
          pair(lossy, key, $, _),
          pair(lossy, entry, $, _)
        ]);
      }
      return index;
    }
    case SET: {
      const entries = [];
      const index = as([TYPE, entries], value, $, _);
      for (const entry of value) {
        if (lossy && shouldSkip(typeOf(entry)))
          continue;

        entries.push(pair(lossy, entry, $, _));
      }
      return index;
    }
  }

  const {message} = value;
  return as([TYPE, {name: type, message}], value, $, _);
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} serializable a serializable value.
 * @param {{lossy?: boolean}?} options an object with a `lossy` property that,
 *  if `true`, will not throw errors on incompatible types, and behave more
 *  like JSON stringify would behave. Symbol and Function will be discarded.
 * @returns {Record[]}
 */
 const serialize = (serializable, options = {}) => {
  const _ = [];
  return pair(!!options.lossy, serializable, new Map, _), _;
};
exports.serialize = serialize;
