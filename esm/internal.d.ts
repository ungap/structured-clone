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
} from "./types.js";

/**
 * Internal representation of a serialized entity. If a new item type
 * is added to the list above,it must be added to the union type for 'type' below.
 *
 * The type is based on the concept of a "Record" as used in the algorithm specified
 * in the WHATWG HTML Living Standard 2.7.3 StructuredSerializeInternal
 * @link https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
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

/**
 * Types which can be safely handled by this module.
 *
 * Other TypedArrays other than u/int8, u/int16, & u/int43 types can be used
 * at your own risk. They should work but are not guaranteed.
 */
export type Cloneable = Exclude<StructuredCloneSupportedTypes, NotSupportedYet>;

/**
 * Limitation Defined by this project's implementation. See README.md
 */
type NotSupportedYet =
  | Blob
  | File
  | FileList
  | ImageBitmap
  | ImageData
  | ArrayBuffer
  // Only Some TypedArrays are safely Supported
  | UnsupportedTypedArray;

/**
 * Limitation Defined by this project's implementation. See README.md
 */
type SupportedTypedArray = Uint8Array | Uint16Array | Uint32Array;

/**
 * Limitation Defined by this project's implementation. See README.md
 */
type UnsupportedTypedArray = Exclude<TypedArray, SupportedTypedArray>;

// ---- From MDN --------------------------

/**
 * Copy-Paste from MDN on 2023-04-28
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types for caveats
 */
type StructuredCloneSupportedTypes =
  // Javascript types
  | Array<any>
  | ArrayBuffer
  | Boolean
  | DataView
  | Date
  | Error
  | Error // See caveat at @link above
  | Map<any, any>
  | Object // Only plain objects (e.g. from object literals).
  | SupportedPrimitives
  | RegExp // Note that lastIndex is not preserved.
  | Set<any>
  | String
  | TypedArray
  // Web/API Types
  | Blob
  | CryptoKey
  | DOMException // browsers must serialize the properties name and message. Other attributes may also be serialized/cloned.
  | DOMMatrix
  | DOMMatrixReadOnly
  | DOMPoint
  | DOMPointReadOnly
  | DOMQuad
  | DOMRect
  | DOMRectReadOnly
  | File
  | FileList
  | FileSystemDirectoryHandle
  | FileSystemFileHandle
  | FileSystemHandle
  | ImageBitmap
  | ImageData
  | RTCCertificate;
// These are specified by MDN, but didn't have definitions in the Typescript lib
// | AudioData
// | CropTarget
// | GPUCompilationInfo
// | GPUCompilationMessage
// | VideoFrame

/**
 * Copy-Paste from MDN on 2023-04-28
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types
 */
type SupportedPrimitives = Omit<Primitives, Symbol>; // Not symbol

/**
 * Copy-Paste from MDN on 2023-04-28
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values
 */
type Primitives =
  | null
  | undefined
  | boolean
  | number
  | bigint
  | string
  | symbol;

/**
 * Copy-Paste from MDN on 2023-04-28
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
 */
type TypedArray =
  // 8
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  // 16
  | Uint16Array
  | Int16Array
  // 32
  | Uint32Array
  | Int32Array
  | Float32Array
  // 64
  | Float64Array
  // | BigUInt64Array // This is specified by MDN, but didn't have a definition in the Typescript lib
  | BigInt64Array;
