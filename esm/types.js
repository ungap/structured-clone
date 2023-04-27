export const VOID       = -1;
export const PRIMITIVE  = 0;
export const ARRAY      = 1;
export const OBJECT     = 2;
export const DATE       = 3;
export const REGEXP     = 4;
export const MAP        = 5;
export const SET        = 6;
export const ERROR      = 7;
export const BIGINT     = 8;
// export const SYMBOL = 9;

/**
 * Internal representation of a serialized entity. If a new item type
 * is added to the list above,it must be added to the union type for 'type' below
 * @typedef {[type: typeof VOID | typeof PRIMITIVE | typeof ARRAY | typeof OBJECT | typeof DATE | typeof REGEXP | typeof MAP | typeof SET | typeof ERROR | typeof BIGINT, value: any]} Serialized
 */