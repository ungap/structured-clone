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
            return as([type, value.map(entry => _serialize(entry, $, _))]);
          case 'Object': {
            const entries = [];
            for (const key of keys(value))
              entries.push([key, _serialize(value[key], $, _)]);
            return as([type, entries]);
          }
          case 'Date':
            return as([type, value.toISOString()]);
          case 'RegExp': {
            const {source, flags} = value;
            return as([type, {source, flags}]);
          }
          case 'Map': {
            const entries = [];
            for (const [key, entry] of value)
              entries.push([_serialize(key, $, _), _serialize(entry, $, _)]);
            return as([type, entries]);
          }
          case 'Set': {
            const values = [];
            for (const entry of value)
              values.push(_serialize(entry, $, _));
            return as([type, values]);
          }
          case 'Boolean':
          case 'Number':
          case 'String':
            return as([type, value.valueOf()]);
        }

        if (type.includes('Array'))
          return as([type, [...value]]);

        if (type.includes('Error')) {
          const {message} = value;
          return as(['Error', {name: type, message}]);
        }

        throw new TypeError;
      }
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return as(['primitive', value]);
    case 'bigint':
      return as(['BigInt', value.toString()]);
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
