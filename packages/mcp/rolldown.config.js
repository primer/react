import {defineConfig} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import packageJson from './package.json' with {type: 'json'}

const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

export default defineConfig([
  {
    input: {
      index: './src/index.ts',
      stdio: './src/transports/stdio.ts',
    },
    platform: 'node',
    external,
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
  {
    input: {
      index: './src/index.ts',
      'transports/stdio': './src/transports/stdio.ts',
    },
    platform: 'node',
    external,
    plugins: [
      dts({
        emitDtsOnly: true,
        sourcemap: false,
        tsconfig: './tsconfig.build.json',
      }),
    ],
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
])
