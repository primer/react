import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with {type: 'json'}

const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
}

const baseConfig = {
  input: ['src/index.ts', 'src/experimental.ts', 'src/deprecated.ts'],
  external: dependencies.map(createPackageRegex),
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    babel({
      presets: ['@babel/preset-typescript'],
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
  ],
}

export default [
  // ESM
  {
    ...baseConfig,
    output: {
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },

  // CommonJS
  {
    ...baseConfig,
    output: {
      dir: 'lib',
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'auto',
    },
  },
]
