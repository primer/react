import {defineConfig} from 'rolldown/config'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with {type: 'json'}

const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
].map(name => new RegExp(`^${name}(/.*)?`))

export default defineConfig({
  input: ['./src/generated/index.ts'],
  external,
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    babel({
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            target: '18',
          },
        ],
        '@babel/plugin-transform-runtime',
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'runtime',
    }),
  ],
  output: {
    dir: './dist',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
})
