import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

const formats = ['esm', 'umd']
const plugins = [
  babel({exclude: 'node_modules/**', runtimeHelpers: true}),
  resolve(),
  commonjs(),
  terser(),
  visualizer({sourcemap: true})
]

export default [
  {
    input: 'src/index.js',
    external: ['styled-components', 'react', 'react-dom'],
    plugins,
    output: formats.map(format => ({
      file: `dist/browser.${format}.js`,
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
