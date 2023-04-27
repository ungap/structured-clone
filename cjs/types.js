'use strict';
const VOID       = -1;
exports.VOID = VOID;
const PRIMITIVE  = 0;
exports.PRIMITIVE = PRIMITIVE;
const ARRAY      = 1;
exports.ARRAY = ARRAY;
const OBJECT     = 2;
exports.OBJECT = OBJECT;
const DATE       = 3;
exports.DATE = DATE;
const REGEXP     = 4;
exports.REGEXP = REGEXP;
const MAP        = 5;
exports.MAP = MAP;
const SET        = 6;
exports.SET = SET;
const ERROR      = 7;
exports.ERROR = ERROR;
const BIGINT     = 8;
exports.BIGINT = BIGINT;
// export const SYMBOL = 9;

/**
 * Internal representation of a serialized entity. If a new item type
 * is added to the list above,it must be added to the union type for 'type' below
 * @typedef {[type: typeof VOID | typeof PRIMITIVE | typeof ARRAY | typeof OBJECT | typeof DATE | typeof REGEXP | typeof MAP | typeof SET | typeof ERROR | typeof BIGINT, value: any]} Serialized
 */