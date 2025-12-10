import path from 'node:path'
import babel from '@rollup/plugin-babel'
import {defineConfig} from 'rolldown'
import {importCSS} from 'rolldown-plugin-import-css'
import postcssPresetPrimer from 'postcss-preset-primer'
import {isSupported} from './script/react-compiler.mjs'
import packageJson from './package.json' with {type: 'json'}

const input = new Set([
  // "exports"
  // "."
  'src/index.ts',

  // "./experimental"
  'src/experimental/index.ts',

  // "./deprecated"
  'src/deprecated/index.ts',

  // "./next"
  'src/next/index.ts',
])

function getEntrypointsFromInput(input) {
  return Object.fromEntries(
    Array.from(input).map(value => {
      const relativePath = path.relative('src', value)
      return [path.join(path.dirname(relativePath), path.basename(relativePath, path.extname(relativePath))), value]
    }),
  )
}

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
}

const postcssModulesOptions = {
  generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
}

const baseConfig = {
  input: {
    ...getEntrypointsFromInput(input),
    // "./test-helpers"
    'test-helpers': 'src/utils/test-helpers.tsx',
  },
  plugins: [
    babel({
      extensions,
      exclude: /node_modules/,
      babelHelpers: 'inline',
      babelrc: false,
      configFile: false,
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {
            modules: false,
            runtime: 'automatic',
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            target: '18',
            sources: filepath => isSupported(filepath),
          },
        ],
        'macros',
        'add-react-displayname',
        'dev-expression',
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        [
          'babel-plugin-transform-replace-expressions',
          {
            replace: {
              __DEV__: "process.env.NODE_ENV !== 'production'",
            },
          },
        ],
      ],
    }),
    importCSS({
      modulesRoot: 'src',
      postcssPlugins: [postcssPresetPrimer()],
      postcssModulesOptions,
    }),
  ],
  onwarn(warning, defaultHandler) {
    // Dependencies or modules may use "use client" as an indicator for React
    // Server Components that this module should only be loaded on the client.
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
      return
    }

    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw warning
    }

    defaultHandler(warning)
  },
}

export default defineConfig({
  ...baseConfig,
  external: dependencies.map(createPackageRegex),
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
})
