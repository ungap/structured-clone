# structuredClone polyfill

[![build status](https://github.com/ungap/structured-clone/actions/workflows/node.js.yml/badge.svg)](https://github.com/ungap/structured-clone/actions) [![Coverage Status](https://coveralls.io/repos/github/ungap/structured-clone/badge.svg?branch=main)](https://coveralls.io/github/ungap/structured-clone?branch=main)

An env agnostic serializer and deserializer with recursion ability and types beyond *JSON* from the *HTML* standard itself.

  * [Supported Types](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types)
    * *not supported yet*: Blob, File, FileList, ImageBitmap, ImageData, and ArrayBuffer, but typed arrays are supported without major issues, but u/int8, u/int16, and u/int32 are the only safely suppored (right now).
    * *not possible to implement*: the `{transfer: []}` option can be passed but it's completely ignored.
  * [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
  * [Serializer](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal)
  * [Deserializer](https://html.spec.whatwg.org/multipage/structured-data.html#structureddeserialize)

Serialized values can be safely stringified as *JSON* too, and deserialization resurrect all values, even recursive, or more complex than what *JSON* allows.


### Example

Check the [100% test coverage](./test/index.js) to know even more.

```js
// as default export
import structuredClone from '@ungap/structured-clone';
const cloned = structuredClone({any: 'serializable'});

// as independent serializer/deserializer
import {serialize, deserialize} from '@ungap/structured-clone';

// the result can be stringified as JSON without issues
// even if there is recursive data, bigint values,
// typed arrays, and so on
const serialized = serialize({any: 'serializable'});

// the result will be a replica of the original object
const deserialized = deserialize(serialized);
```
