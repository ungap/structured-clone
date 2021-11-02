import {deserialize} from './deserialize.js';
import {serialize} from './serialize.js';

/**
 * @typedef {Array<string,any>} Record a type representation
 */

/**
 * Returns an array of serialized Records.
 * @param {any} any a serializable value.
 * @param {{transfer: any[]}?} options an object with a transfoer property.
 *  This is currently not supported, all values are always cloned.
 * @returns {Record[]}
 */
export default typeof structuredClone === "function" ?
  structuredClone :
  (any, options) => deserialize(serialize(any, options));

export {deserialize, serialize};
