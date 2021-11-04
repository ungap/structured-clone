import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './esm/json.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    esModule: false,
    exports: 'named',
    file: './structured-json.js',
    format: 'iife',
    name: 'StructuredJSON'
  }
};
