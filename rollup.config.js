import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        'transform-object-rest-spread'
      ],
      presets: [
        // because rollup warns us if we don't?
        'es2015-rollup',
        // transpile most of the things,
        // but _not_ import and export statements
        ['env', {modules: false}],
        // <Foo/> => React.createElement(Foo), et al
        'react'
      ]
    }),
    commonjs()
  ],
  output: {
    file: 'dist/index.js',
    format: 'esm'
  }
}
