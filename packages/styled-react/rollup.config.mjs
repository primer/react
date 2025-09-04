import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
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
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
    plugins: [...baseConfig.plugins, commonjs()],
    output: {
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name].mjs',
    },
  },

  // CommonJS
  {
    ...baseConfig,
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      commonjs({
        defaultIsModuleExports: 'auto',
        transformMixedEsModules: true,
      }),
      babel({
        presets: ['@babel/preset-typescript'],
        extensions: ['.ts', '.tsx'],
        babelHelpers: 'bundled',
      }),
    ],
    output: {
      dir: 'lib',
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'auto',
      interop: 'compat',
    },
  },
]
