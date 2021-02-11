import jsx from 'acorn-jsx'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const formats = ['esm', 'umd']

const plugins = [resolve({extensions}), typescript(), commonjs(), visualizer({sourcemap: true})]

export default [
  {
    input: 'src/index.ts',
    external: ['styled-components', 'react', 'react-dom'],
    acornInjectPlugins: [jsx()],
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
