import {defineConfig} from 'rolldown/config'
import type {RolldownOptions} from 'rolldown'
import packageJson from './package.json' with {type: 'json'}

const external = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.devDependencies)].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

const config: RolldownOptions = defineConfig({
  input: 'src/cli.ts',
  external,
  platform: 'node',
})

export default config
