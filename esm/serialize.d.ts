import { Clonable, Serialized } from "./internal";

export function serialize(
  value: Clonable,
  options?: { lossy?: boolean; json?: boolean }
): Serialized[];
