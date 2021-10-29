# structuredClone polyfill

An env agnostic serializer and deserializer with recursion ability and types beyond *JSON* from the *HTML* standard itself.

  * [Supported Types](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types)
  * [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
  * [Serializer](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal)
  * [Deserializer](https://html.spec.whatwg.org/multipage/structured-data.html#structureddeserialize)

```js
// as default export
import structuredClone from '@ungap/structured-clone';

// as independent serializer/deserializer
import {serialize, deserialize} from '@ungap/structured-clone';
```
