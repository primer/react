import babel from '@rollup/plugin-babel'
import {defineConfig} from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with {type: 'json'}

const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
}

export default defineConfig({
  input: ['src/index.ts', 'src/experimental.ts', 'src/deprecated.ts'],
  external: dependencies.map(createPackageRegex),
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    babel({
      presets: ['@babel/preset-typescript'],
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
