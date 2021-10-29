'use strict';
const _item = ([type, value], info, as) => {
  switch (type) {
    case 'primitive':
      return as(value);
    case 'Date':
      return as(new Date(value));
    case 'RegExp': {
      const {source, flags} = value;
      return as(new RegExp(source, flags));
    }
    case 'Object': {
      const object = as({});
      for (const [key, index] of value)
        object[key] = _deserialize(index, info);
      return object;
    }
    case 'Array': {
      const arr = as([]);
      for (const index of value)
        arr.push(_deserialize(index, info));
      return arr;
    }
    case 'Map': {
      const map = as(new Map);
      for (const [key, index] of value)
        map.set(key, _deserialize(index, info));
      return map;
    }
    case 'Set': {
      const set = as(new Set);
      for (const index of value)
        set.add(_deserialize(index, info));
      return set;
    }
    case 'BigInt':
      return as(BigInt(value));
    case 'Error': {
      const {name, message} = value;
      return as(new globalThis[name](message));
    }
    case 'Boolean':
      return as(new Boolean(value));
    case 'Number':
      return as(new Number(value));
    case 'String':
      return as(new String(value));
  }
  return as(new globalThis[type](value));
};

const _deserialize = (index, info) => {
  const {$, _} = info;
  if ($.has(index))
    return $.get(index);

  return _item(_[index], info, deserialized => {
    $.set(index, deserialized);
    return deserialized;
  });
};

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param {Record[]} serialized a previously serialized value.
 * @returns {any}
 */
const deserialize = (_) => _deserialize(0, {$: new Map, _});
exports.deserialize = deserialize;
