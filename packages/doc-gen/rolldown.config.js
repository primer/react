import {defineConfig} from 'rolldown'
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
  input: './src/index.ts',
  platform: 'node',
  external: dependencies.map(createPackageRegex),
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
