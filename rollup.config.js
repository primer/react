import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const formats = ['esm', 'umd'] // 'cjs' ?
const plugins = [babel({exclude: 'node_modules/**'}), commonjs()]

export default [
  {
    input: 'src/index.js',
    plugins,
    external: ['styled-components', 'react'],
    output: formats.map(format => ({
      file: `dist/index.${format}.js`,
      format,
      name: 'primer'
    }))
  }
]
