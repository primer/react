import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const formats = ['esm', 'umd'] // 'cjs' ?
const plugins = [babel({exclude: 'node_modules/**'}), commonjs()]

export default [
  {
    input: 'src/index.js',
    plugins,
    external: [
      "styled-components",
      "@githubprimer/octicons-react"
    ],
    output: formats.map(format => ({
      file: `dist/index.${format}.js`,
      format,
      name: 'primer'
    }))
  },
  {
    input: 'src/css.js',
    plugins,
    output: {
      file: 'dist/css.js',
      format: 'umd',
      name: 'primerCSS'
    }
  }
]
