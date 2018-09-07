import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const formats = ['esm', 'umd'] // 'cjs' ?

export default {
  input: 'src/index.js',
  plugins: [
    babel({exclude: 'node_modules/**'}),
    commonjs()
  ],
  output: formats.map(format => ({
    file: `dist/index.${format}.js`,
    format,
    name: 'PrimerReact'
  }))
}
