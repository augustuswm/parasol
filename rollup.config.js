let babel = require('rollup-plugin-babel');
let flow = require('rollup-plugin-flow');
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

// rollup.config.js
export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'esm'
    },
    plugins: [
      flow(),
      postcss(),
      babel()
    ]
  },
  {
    input: 'example/src/example.js',
    output: {
      file: 'example/dist/example.js',
      format: 'iife',
      globals: {
        react: 'React'
      }
    },
    plugins: [
      flow(),
      postcss(),
      babel(),
      resolve()
    ]
  }
];