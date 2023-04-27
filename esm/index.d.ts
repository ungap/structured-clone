import { deserialize } from "./deserialize.js";
import { serialize } from "./serialize.js";
import type { Clonable } from "./internal";

export default function <T extends Clonable>(
  any: T,
  options?: { transfer: Transferable[] }
): T;

export { deserialize, serialize };
