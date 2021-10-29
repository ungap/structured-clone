const {toString} = {};
const {keys} = Object;
const defaultOptions = {transfer: []};

const _serialize = (value, info) => {
  const {$, _} = info;
  if ($.has(value))
    return $.get(value);

  const i = _.push(value) - 1;
  $.set(value, i);

  const as = serialized => {
    _[i] = serialized;
    return i;
  };

  switch (typeof value) {
    case 'bigint':
      return as(['BigInt', value.toString()]);
    case 'object':
      if (value !== null) {
        const type = toString.call(value).slice(8, -1);
        switch (type) {
          case 'Object': {
            const entries = [];
            for (const key of keys(value))
              entries.push([key, _serialize(value[key], info)]);
            return as([type, entries]);
          }
          case 'Boolean':
          case 'Number':
          case 'String':
            return as([type, value.valueOf()]);
          case 'Date':
            return as([type, value.toISOString()]);
          case 'RegExp': {
            const {source, flags} = value;
            return as([type, {source, flags}]);
          }
          case 'Map': {
            const entries = [];
            for (const [key, entry] of value)
              entries.push([_serialize(key, info), _serialize(entry, info)]);
            return as([type, entries]);
          }
          case 'Array': {
            const arr = [];
            for (const entry of value)
              arr.push(_serialize(entry, info));
            return as([type, arr]);
          }
          case 'Set': {
            const values = [];
            for (const entry of value)
              values.push(_serialize(entry, info));
            return as([type, values]);
          }
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
    default:
      throw new TypeError;
  }
};

/**
 * Returns an array of serialized Records.
 * @param {any} any a serializable value.
 * @param {object?} options an object with a transfoer property.
 *  This is currently not supported, all values are always cloned.
 * @returns 
 */
 export const serialize = (any, {transfer} = defaultOptions) => {
  const _ = [];
  return _serialize(any, {transfer, $: new Map, _}), _;
};
