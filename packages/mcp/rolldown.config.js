import {defineConfig} from 'rolldown'
import packageJson from './package.json' with {type: 'json'}

const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

export default defineConfig({
  input: {
    index: './src/index.ts',
    stdio: './src/transports/stdio.ts',
  },
  platform: 'node',
  external,
  output: {
    dir: 'dist',
    format: 'esm',
    importAttributesKey: 'with',
  },
})
