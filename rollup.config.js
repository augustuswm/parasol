let babel = require('rollup-plugin-babel');
let flow = require('rollup-plugin-flow');

// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    flow(),
    babel()
  ]
};