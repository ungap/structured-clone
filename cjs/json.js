'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {deserialize} = require('./deserialize.js');
const {serialize} = require('./serialize.js');

const {parse: $parse, stringify: $stringify} = JSON;
const options = {json: true, lossy: true};

const parse = str => deserialize($parse(str));
exports.parse = parse;

const stringify = str => $stringify(serialize(str, options));
exports.stringify = stringify;
