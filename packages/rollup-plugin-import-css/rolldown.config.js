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

export default [
  {
    input: ['./src/index.ts'],
    external,
    plugins: [],
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
]
