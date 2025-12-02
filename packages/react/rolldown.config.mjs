import babel from '@rollup/plugin-babel'
import {importCSS} from 'rolldown-plugin-import-css'
import postcssPresetPrimer from 'postcss-preset-primer'
import MagicString from 'magic-string'
import {defineConfig} from 'rolldown'
import {isSupported} from './script/react-compiler.mjs'
import packageJson from './package.json' with {type: 'json'}

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

export default defineConfig([
  {
    input: [
      // "exports"
      // "."
      'src/index.ts',

      // "./experimental"
      'src/experimental/index.ts',

      // "./deprecated"
      'src/deprecated/index.ts',

      // "./next"
      'src/next/index.ts',
    ],
    external: dependencies.map(createPackageRegex),
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
          'add-react-displayname',
          'dev-expression',
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
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
  {
    input: {
      'test-helpers': 'src/utils/test-helpers.tsx',
    },
    platform: 'node',
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
])
