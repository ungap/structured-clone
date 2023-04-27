import {
  VOID,
  PRIMITIVE,
  ARRAY,
  OBJECT,
  DATE,
  REGEXP,
  MAP,
  SET,
  ERROR,
  BIGINT,
} from "./types";

/**
 * Internal representation of a serialized entity. If a new item type
 * is added to the list above,it must be added to the union type for 'type' below
 */
export type Serialized = [
  type:
    | typeof VOID
    | typeof PRIMITIVE
    | typeof ARRAY
    | typeof OBJECT
    | typeof DATE
    | typeof REGEXP
    | typeof MAP
    | typeof SET
    | typeof ERROR
    | typeof BIGINT,
  value: any
];

// @ts-expect-error
export type Clonable = any; // TODO create proper type

