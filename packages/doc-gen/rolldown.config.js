import {defineConfig} from 'rollup'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with {type: 'json'}

const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

const config = defineConfig({
  input: ['./src/index.ts'],
  external,
  platform: 'node',
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
    babel({
      extensions: ['.js', '.cjs', '.mjs', '.ts', '.tsx'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
  },
})

export default config
