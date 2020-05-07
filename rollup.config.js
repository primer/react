import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

// NOTE: this can be removed once the next version of rollup-plugin-commonjs is released
const namedExports = {
  'prop-types': ['object', 'func', 'oneOfType', 'node', 'bool', 'string', 'any', 'arrayOf'],
  'react-dom': ['createPortal'],
  'react-is': ['isValidElementType']
}

const formats = ['esm', 'umd'] // 'cjs' ?
function plugins({minify = false}) {
  const allPlugins = [
    babel({exclude: 'node_modules/**', runtimeHelpers: true}),
    resolve(),
    commonjs({namedExports}),
    visualizer({sourcemap: true})
  ]

  if (minify) {
    allPlugins.push(terser())
  }

  return allPlugins
}

const prod = process.env.NODE_ENV === 'production'

export default [
  {
    input: 'src/index.js',
    plugins: plugins({minify: prod}),
    external: ['styled-components', 'react', 'react-dom'],
    output: formats.map(format => ({
      file: `dist/browser.${format}.${prod ? 'min' : 'dev'}.js`,
      format,
      sourcemap: true,
      name: 'primer',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'styled-components': 'styled'
      }
    }))
  }
]
