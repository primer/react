import typescript from 'rollup-plugin-typescript'

const formats = ['esm', 'umd'] // 'cjs' ?
const plugins = [typescript()]

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
