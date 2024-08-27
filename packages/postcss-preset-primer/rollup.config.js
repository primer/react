import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import packageJson from './package.json' with {type: 'json'}

const external = ['dependencies', 'devDependencies', 'peerDependencies'].flatMap(type => {
  if (packageJson[type]) {
    return Object.keys(packageJson[type]).map(name => {
      return new RegExp(`^${name}(/.*)?`)
    })
  }
  return []
})

const baseConfig = {
  input: 'src/index.js',
  external: [...external, new RegExp('^node:')],
  plugins: [nodeResolve(), commonjs()],
}

export default [
  {
    ...baseConfig,
    output: {
      format: 'esm',
      file: 'dist/index.mjs',
    },
  },
  {
    ...baseConfig,
    output: {
      format: 'cjs',
      file: 'dist/index.cjs',
    },
  },
]
