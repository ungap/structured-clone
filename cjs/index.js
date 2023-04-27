'use strict';
const {deserialize} = require('./deserialize.js');
const {serialize} = require('./serialize.js');

/**
 * Returns an array of serialized Records.
 *
 * @note The `transfer` property in the `options` parameter is
 *  currently not supported, all values are always cloned.
 *
 * @note If only standard options are provided (`transfer` is standard,
 * while `json` is not), and If a native implementation of `structuredClone()`
 * is available at the time of invocation, the native implementation is
 * used instead of this module's code.
 *
 * @type {<T>(any: T, options?: {transfer: Transferable[]}) => T}
 */
Object.defineProperty(exports, '__esModule', {value: true}).default = typeof structuredClone === "function" ?
  /* c8 ignore start */
  (any, options) => (
    options && ('json' in options || 'lossy' in options) ?
      deserialize(serialize(any, options)) : structuredClone(any)
  ) :
  (any, options) => deserialize(serialize(any, options));
  /* c8 ignore stop */

exports.deserialize = deserialize;
exports.serialize = serialize;