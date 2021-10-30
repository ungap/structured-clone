import {
  PRIMITIVE, ARRAY, OBJECT,
  DATE, REGEXP, MAP, SET,
  ERROR, BIGINT
} from './types.js';

const {toString} = {};
const {keys} = Object;

const _serialize = (value, $, _) => {
  if ($.has(value))
    return $.get(value);

  const index = _.push(value) - 1;
  $.set(value, index);

  const as = serialized => {
    _[index] = serialized;
    return index;
  };

  switch (typeof value) {
    case 'object':
      if (value !== null) {
        const type = toString.call(value).slice(8, -1);
        switch (type) {
          case 'Array':
            return as([ARRAY, value.map(entry => _serialize(entry, $, _))]);
          case 'Object': {
            const entries = [];
            for (const key of keys(value))
              entries.push([_serialize(key, $, _), _serialize(value[key], $, _)]);
            return as([OBJECT, entries]);
          }
          case 'Date':
            return as([DATE, value.toISOString()]);
          case 'RegExp': {
            const {source, flags} = value;
            return as([REGEXP, {source, flags}]);
          }
          case 'Map': {
            const entries = [];
            for (const [key, entry] of value)
              entries.push([_serialize(key, $, _), _serialize(entry, $, _)]);
            return as([MAP, entries]);
          }
          case 'Set': {
            const values = [];
            for (const entry of value)
              values.push(_serialize(entry, $, _));
            return as([SET, values]);
          }
          case 'Boolean':
          case 'Number':
          case 'String':
            return as([type, value.valueOf()]);
          case 'BigInt':
            return as([type, value.toString()]);
        }

        if (type.includes('Array'))
          return as([type, [...value]]);

        if (type.includes('Error')) {
          const {message} = value;
          return as([ERROR, {name: type, message}]);
        }

        throw new TypeError;
      }
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return as([PRIMITIVE, value]);
    case 'bigint':
      return as([BIGINT, value.toString()]);
    default:
      throw new TypeError;
  }
};

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} serializable a serializable value.
 * @returns {Record[]}
 */
 export const serialize = serializable => {
  const _ = [];
  return _serialize(serializable, new Map, _), _;
};
