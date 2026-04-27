import {defineConfig} from 'rolldown'
import babel from '@rolldown/plugin-babel'
import packageJson from './package.json' with {type: 'json'}

const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

const config = defineConfig({
  input: ['./src/index.ts', './src/transports/stdio.ts'],
  external,
  plugins: [
    babel({
      include: /\.[cm]?[jt]sx?$/,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: false,
          },
        ],
        '@babel/preset-typescript',
      ],
      runtimeVersion: packageJson.dependencies['@babel/runtime'],
    }),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
  },
})

export default config
