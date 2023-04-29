import { Cloneable, Serialized } from "./internal.js";

/**
 * Returns a deserialized value from a serialized array of Records.
 * @param serialized - a previously serialized value.
 */
export function deserialize(serialized: Serialized[]): Cloneable;
