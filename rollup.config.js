import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import packageJson from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const formats = ['esm', 'umd']
const external = [
  ...Object.keys(packageJson.peerDependencies),
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies)
]

const baseConfig = {
  input: 'src/index.ts',
  external: id => {
    return external.some(pkg => {
      return id.startsWith(pkg)
    })
  },
  plugins: [
    resolve({
      extensions
    }),
    commonjs(),
    babel({
      extensions,
      exclude: /node_modules/,
      runtimeHelpers: true
    })
  ]
}

export default [
  {
    ...baseConfig,
    output: {
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  },
  {
    ...baseConfig,
    output: {
      dir: 'lib',
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named'
    }
  },
  {
    ...baseConfig,
    external: ['styled-components', 'react', 'react-dom'],
    plugins: [...baseConfig.plugins, terser(), visualizer({sourcemap: true})],
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
