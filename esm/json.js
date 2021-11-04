/*! (c) Andrea Giammarchi - ISC */

import {deserialize} from './deserialize.js';
import {serialize} from './serialize.js';

const {parse: $parse, stringify: $stringify} = JSON;
const options = {json: true, lossy: true};

export const parse = str => deserialize($parse(str));

export const stringify = str => $stringify(serialize(str, options));
