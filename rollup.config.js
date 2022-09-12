import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import packageJson from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
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
  // ESM
  {
    ...baseConfig,
    output: {
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  },

  // CommonJS
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

  // Bundles
  {
    ...baseConfig,
    external: ['styled-components', 'react', 'react-dom'],
    plugins: [...baseConfig.plugins, terser(), visualizer({sourcemap: true})],
    output: ['esm', 'umd'].map(format => ({
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
