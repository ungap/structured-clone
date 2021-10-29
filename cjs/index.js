'use strict';
const {deserialize} = require('./deserialize.js');
const {serialize} = require('./serialize.js');
const dflt = {transfer: []};

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
Object.defineProperty(exports, '__esModule', {value: true}).default = (any, options = dflt) => deserialize(serialize(any, options));

exports.deserialize = deserialize;
exports.serialize = serialize;
