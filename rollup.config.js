let babel = require('rollup-plugin-babel');
let flow = require('rollup-plugin-flow');
import postcss from 'rollup-plugin-postcss'

// rollup.config.js
export default {
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
};