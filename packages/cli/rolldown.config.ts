import {defineConfig} from 'rolldown'
import packageJson from './package.json' with {type: 'json'}

interface PackageMetadata {
  readonly peerDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
}

const packageMetadata: PackageMetadata = packageJson

const external = [
  ...Object.keys(packageMetadata.peerDependencies ?? {}),
  ...Object.keys(packageMetadata.dependencies ?? {}),
  ...Object.keys(packageMetadata.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

export default defineConfig([
  {
    input: './src/cli.ts',
    platform: 'node',
    external,
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
])
