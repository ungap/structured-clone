import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './esm/json.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    exports: 'named',
    file: './structured-json.js',
    format: 'iife',
    name: 'StructuredJSON'
  }
};
