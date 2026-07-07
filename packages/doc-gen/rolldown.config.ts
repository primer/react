import {defineConfig} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import packageJson from './package.json' with {type: 'json'}

interface PackageMetadata {
  readonly peerDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
}

const packageMetadata: PackageMetadata = packageJson

const dependencies = [
  ...Object.keys(packageMetadata.peerDependencies ?? {}),
  ...Object.keys(packageMetadata.dependencies ?? {}),
  ...Object.keys(packageMetadata.devDependencies ?? {}),
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
