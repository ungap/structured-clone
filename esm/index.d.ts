import { deserialize } from "./deserialize.js";
import { serialize } from "./serialize.js";
import type { Cloneable } from "./internal.js";

/**
 * Polyfilled structuredClone function.
 *
 * Caveat: The `transfer` property in the `options` parameter is ignored:
 * all values are always cloned, except in the case that the native
 * implementation of `structuredClone` is used. (See below for more
 * information on that.)
 *
 * Caveat: If the following are ALL true, the native implementation of
 * `structuredClone` will be used instead of this module's code.
 * - A native implementation of `structuredClone` is present
 *   in the environment already at the time this module is imported
 * - The caller only specified standard options as arguments to
 *   `structuredClone(value, options)` at the time of invocation.
 *   (`transfer` is standard, while `json` & `lossy` are not.)
 *
 * @param options - `transfer` is standard. `json` & `lossy` are not standard.
 */
export default function <T extends Cloneable>(
  any: T,
  options?: {
    transfer: Transferable[]; // Standard
    json: boolean; // Nonstandard
    lossy: boolean; // Nonstandard
  }
): T;

export { deserialize, serialize };
