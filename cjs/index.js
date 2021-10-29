'use strict';
const {deserialize} = require('./deserialize.js');
const {serialize} = require('./serialize.js');

Object.defineProperty(exports, '__esModule', {value: true}).default = (any, options = {transfer: []}) =>
  deserialize(serialize(any, options));

exports.deserialize = deserialize;
exports.serialize = serialize;
