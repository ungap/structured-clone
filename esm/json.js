/*! (c) Andrea Giammarchi - ISC */

import {deserialize} from './deserialize.js';
import {serialize} from './serialize.js';

const {parse: $parse, stringify: $stringify} = JSON;
const options = {json: true, lossy: true};

/**
 * Revive a previously stringified structured clone.
 * @param str previously stringified data as string.
 * @returns whatever was previously stringified as clone.
 */
export const parse = str => deserialize($parse(str));

/**
 * Represent a structured clone value as string.
 * @param any some clone-able value to stringify.
 * @returns the value stringified.
 */
export const stringify = any => $stringify(serialize(any, options));
