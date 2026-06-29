import {defineConfig} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import packageJson from './package.json' with {type: 'json'}

const dependencies = [
  ...Object.keys('peerDependencies' in packageJson ? packageJson.peerDependencies : {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name: string) {
  return new RegExp(`^${name}(/.*)?`)
}

export default defineConfig([
  {
    input: './src/index.ts',
    platform: 'node',
    external: dependencies.map(createPackageRegex),
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
  {
    input: './src/index.ts',
    platform: 'node',
    external: dependencies.map(createPackageRegex),
    plugins: [
      dts({
        emitDtsOnly: true,
        sourcemap: true,
        tsconfig: './tsconfig.build.json',
      }),
    ],
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
])
