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

      /**
       * This custom rollup plugin allows us to preserve directives in source
       * code, such as "use client", in order to support React Server Components.
       *
       * The source for this plugin is inspired by:
       * https://github.com/Ephem/rollup-plugin-preserve-directives
       */
      {
        name: 'preserve-directives',
        transform(code) {
          const ast = this.parse(code)
          if (ast.type !== 'Program' || !ast.body) {
            return {
              code,
              ast,
              map: null,
            }
          }

          let hasClientDirective = false

          for (const node of ast.body) {
            if (!node) {
              continue
            }

            if (node.type !== 'ExpressionStatement') {
              continue
            }

            if (node.directive === 'use client') {
              hasClientDirective = true
              break
            }
          }

          if (hasClientDirective) {
            return {
              code,
              ast,
              map: null,
              meta: {
                hasClientDirective: true,
              },
            }
          }

          return {
            code,
            ast,
            map: null,
          }
        },
        renderChunk: {
          order: 'post',
          handler(code, chunk, options) {
            // If `preserveModules` is not set to true, we can't be sure if the client
            // directive corresponds to the whole chunk or just a part of it.
            if (!options.preserveModules) {
              return undefined
            }

            let chunkHasClientDirective = false

            for (const moduleId of Object.keys(chunk.modules)) {
              const hasClientDirective = this.getModuleInfo(moduleId)?.meta?.hasClientDirective
              if (hasClientDirective) {
                chunkHasClientDirective = true
                break
              }
            }

            if (chunkHasClientDirective) {
              const transformed = new MagicString(code)
              transformed.prepend(`"use client";\n`)
              const sourcemap = transformed.generateMap({
                includeContent: true,
              })
              return {
                code: transformed.toString(),
                map: sourcemap,
              }
            }

            return null
          },
        },
      },
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
