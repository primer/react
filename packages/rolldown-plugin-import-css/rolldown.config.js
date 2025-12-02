import {defineConfig} from 'rolldown'
import typescript from 'rollup-plugin-typescript2'
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
const external = Array.from(dependencies).map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

export default defineConfig({
  input: './src/index.ts',
  external,
  platform: 'node',
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
