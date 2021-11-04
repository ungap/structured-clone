var StructuredJSON = (function (exports) {
  'use strict';

  const PRIMITIVE  = 0;
  const ARRAY      = 1;
  const OBJECT     = 2;
  const DATE       = 3;
  const REGEXP     = 4;
  const MAP        = 5;
  const SET        = 6;
  const ERROR      = 7;
  const BIGINT     = 8;
  // export const SYMBOL = 9;

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
      case 'BigInt':
        return as(Object(BigInt(value)));
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

  const serializer = (strict, json, $, _) => {

    const as = (out, value) => {
      const index = _.push(out) - 1;
      $.set(value, index);
      return index;
    };

    const pair = value => {
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
              if (strict)
                throw new TypeError('unable to serialize ' + type);
              entry = null;
              break;
          }
          return as([TYPE, entry], value);
        }
        case ARRAY: {
          if (type)
            return as([type, [...value]], value);
    
          const arr = [];
          const index = as([TYPE, arr], value);
          for (const entry of value)
            arr.push(pair(entry));
          return index;
        }
        case OBJECT: {
          if (type) {
            switch (type) {
              case 'BigInt':
                return as([type, value.toString()], value);
              case 'Boolean':
              case 'Number':
              case 'String':
                return as([type, value.valueOf()], value);
            }
          }

          if (json && ('toJSON' in value))
            return pair(value.toJSON());

          const entries = [];
          const index = as([TYPE, entries], value);
          for (const key of keys(value)) {
            if (strict || !shouldSkip(typeOf(value[key])))
              entries.push([pair(key), pair(value[key])]);
          }
          return index;
        }
        case DATE:
          return as([TYPE, value.toISOString()], value);
        case REGEXP: {
          const {source, flags} = value;
          return as([TYPE, {source, flags}], value);
        }
        case MAP: {
          const entries = [];
          const index = as([TYPE, entries], value);
          for (const [key, entry] of value) {
            if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
              entries.push([pair(key), pair(entry)]);
          }
          return index;
        }
        case SET: {
          const entries = [];
          const index = as([TYPE, entries], value);
          for (const entry of value) {
            if (strict || !shouldSkip(typeOf(entry)))
              entries.push(pair(entry));
          }
          return index;
        }
      }

      const {message} = value;
      return as([TYPE, {name: type, message}], value);
    };

    return pair;
  };

  /**
   * @typedef {Array<string,any>} Record a type representation
   */

  /**
   * Returns an array of serialized Records.
   * @param {any} value a serializable value.
   * @param {{lossy?: boolean}?} options an object with a `lossy` property that,
   *  if `true`, will not throw errors on incompatible types, and behave more
   *  like JSON stringify would behave. Symbol and Function will be discarded.
   * @returns {Record[]}
   */
   const serialize = (value, {json, lossy} = {}) => {
    const _ = [];
    return serializer(!(json || lossy), !!json, new Map, _)(value), _;
  };

  const {parse: $parse, stringify: $stringify} = JSON;
  const options = {json: true, lossy: true};

  const parse = str => deserialize($parse(str));

  const stringify = str => $stringify(serialize(str, options));

  exports.parse = parse;
  exports.stringify = stringify;

  return exports;

})({});
