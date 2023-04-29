'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {deserialize} = require('./deserialize.js');
const {serialize} = require('./serialize.js');

const {parse: $parse, stringify: $stringify} = JSON;
const options = {json: true, lossy: true};

/**
 * Revive a previously stringified structured clone.
 * @param str previously stringified data as string.
 * @returns whatever was previously stringified as clone.
 */
const parse = str => deserialize($parse(str));
exports.parse = parse;

/**
 * Represent a structured clone value as string.
 * @param any some clone-able value to stringify.
 * @returns the value stringified.
 */
const stringify = any => $stringify(serialize(any, options));
exports.stringify = stringify;
