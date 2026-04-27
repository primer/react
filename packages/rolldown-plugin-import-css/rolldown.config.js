import {builtinModules} from 'node:module'
import {defineConfig} from 'rolldown'
import packageJson from './package.json' with {type: 'json'}

const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const dependencies = new Set(
  dependencyTypes.flatMap(type => {
    if (packageJson[type]) {
      return Object.keys(packageJson[type])
    }
    return []
  }),
)
for (const name of builtinModules) {
  dependencies.add(name)
  dependencies.add(`node:${name}`)
}

const external = Array.from(dependencies).map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

export default defineConfig({
  input: ['./src/index.ts'],
  external,
  plugins: [],
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
})
