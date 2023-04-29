import { deserialize } from "./deserialize.js";
import { serialize } from "./serialize.js";
import type { Cloneable } from "./internal.js";

export default function <T extends Cloneable>(
  any: T,
  options?: { transfer: Transferable[] }
): T;

export { deserialize, serialize };
