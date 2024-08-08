import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import glob from 'fast-glob'
import customPropertiesFallback from 'postcss-custom-properties-fallback'
import {visualizer} from 'rollup-plugin-visualizer'
import {importCSS} from 'rollup-plugin-import-css'
import postcss from 'rollup-plugin-postcss'
import postssPresetPrimer from 'postcss-preset-primer'
import MagicString from 'magic-string'
import packageJson from './package.json' assert {type: 'json'}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const input = new Set([
  // "exports"
  // "."
  'src/index.ts',

  // "./experimental"
  'src/experimental/index.ts',

  // "./drafts"
  'src/drafts/index.ts',

  // "./deprecated"
  'src/deprecated/index.ts',

  // "./next"
  'src/next/index.ts',

  // Make sure all members are exported
  'src/constants.ts',

  ...glob.sync(
    [
      // "./lib-esm/hooks/*"
      'src/hooks/*',

      // "./lib-esm/polyfills/*"
      'src/polyfills/*',

      // "./lib-esm/utils/*"
      'src/utils/*',

      // for backward compatbility, see https://github.com/primer/react/pull/3740
      'src/ActionMenu/index.ts',
    ],
    {
      cwd: __dirname,
      ignore: [
        '**/__tests__/**',
        '*.stories.tsx',

        // File currently imports from package.json
        'src/utils/test-deprecations.tsx',

        // Files use dependencies which are not listed by package
        'src/utils/testing.tsx',
        'src/utils/test-matchers.tsx',
      ],
    },
  ),
])

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const ESM_ONLY = new Set([
  '@github/combobox-nav',
  '@github/markdown-toolbar-element',
  '@github/paste-markdown',
  '@github/relative-time-element',
  '@github/tab-container-element',
  '@lit-labs/react',
  '@oddbird/popover-polyfill',
])
const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
}

const postcssPlugins = [
  postssPresetPrimer(),
  customPropertiesFallback({
    importFrom: [
      () => {
        let customProperties = {}
        const filePaths = glob.sync(['fallbacks/**/*.json', 'docs/functional/themes/light.json'], {
          cwd: path.join(__dirname, '../../node_modules/@primer/primitives/dist/'),
          ignore: ['fallbacks/color-fallbacks.json'],
        })

        for (const filePath of filePaths) {
          const fileData = fs.readFileSync(
            path.join(__dirname, '../../node_modules/@primer/primitives/dist/', filePath),
            'utf8',
          )

          const jsonData = JSON.parse(fileData)
          let result = {}

          if (filePath === 'docs/functional/themes/light.json') {
            for (const variable of Object.keys(jsonData)) {
              result[`--${variable}`] = jsonData[variable].value
            }
          } else {
            result = jsonData
          }

          customProperties = {
            ...customProperties,
            ...result,
          }
        }

        return {customProperties}
      },
    ],
  }),
]

const postcssModulesOptions = {
  generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
}

const baseConfig = {
  input: Array.from(input),
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
          },
        ],
      ],
      plugins: [
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
    resolve({
      extensions,
    }),
    commonjs({
      extensions,
    }),
    importCSS({
      modulesRoot: 'src',
      postcssPlugins,
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
}

export default [
  // ESM
  {
    ...baseConfig,
    external: dependencies.map(createPackageRegex),
    output: {
      interop: 'auto',
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },

  // CommonJS
  {
    ...baseConfig,
    external: dependencies.filter(name => !ESM_ONLY.has(name)).map(createPackageRegex),
    output: {
      interop: 'auto',
      dir: 'lib',
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'auto',
    },
  },

  // Bundles
  {
    ...baseConfig,
    input: 'src/index.ts',
    external: ['styled-components', 'react', 'react-dom'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
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
            },
          ],
        ],
        plugins: [
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
      resolve({
        extensions,
      }),
      commonjs({
        extensions,
      }),
      // PostCSS plugins are defined in postcss.config.js
      postcss({
        extract: 'components.css',
        autoModules: false,
        modules: {
          generateScopedName: 'prc_[local]_[hash:base64:5]',
        },
      }),
      terser(),
      visualizer({sourcemap: true}),
    ],
    output: ['esm', 'umd'].map(format => ({
      interop: 'auto',
      file: `dist/browser.${format}.js`,
      format,
      sourcemap: true,
      name: 'primer',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'styled-components': 'styled',
      },
    })),
  },
]
