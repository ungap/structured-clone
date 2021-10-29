import {deserialize} from './deserialize.js';
import {serialize} from './serialize.js';

export default (any, options = {transfer: []}) =>
  deserialize(serialize(any, options));

export {deserialize, serialize};
