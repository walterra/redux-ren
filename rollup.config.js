import resolve from 'rollup-plugin-node-resolve';
import commonjs from '../rollup-plugin-commonjs/dist/rollup-plugin-commonjs.es.js';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'build/redux-ren.js',
      format: 'umd',
      name: 'ren'
    },
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react/index.js': ['Component', 'PureComponent', 'Children', 'createElement']
        }
      }),
      buble({
        exclude: ['node_modules/**'],
        objectAssign: 'Object.assign'
      }),
      // see https://github.com/rollup/rollup/issues/487
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  }
];
