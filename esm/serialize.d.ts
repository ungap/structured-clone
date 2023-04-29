import { Cloneable, Serialized } from "./internal.js";

export function serialize(
  value: Cloneable,
  options?: { lossy?: boolean; json?: boolean }
): Serialized[];
