import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
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
    plugins: [
      nodeResolve({
        include: /node_modules/,
      }),
      commonjs({
        include: /node_modules/,
      }),
      typescript({
        tsconfig: 'tsconfig.build.json',
      }),
      esbuild(),
    ],
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
]
