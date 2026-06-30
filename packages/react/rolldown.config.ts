import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import {defineConfig, type RolldownOptions} from 'rolldown'
import {preserveDirectives} from 'rolldown-plugin-preserve-directives'
import {dts} from 'rolldown-plugin-dts'
import {importCSS} from 'rolldown-plugin-import-css'
import postcssPresetPrimer from 'postcss-preset-primer'
import {isSupported} from './script/react-compiler.mjs'
import packageJson from './package.json' with {type: 'json'}

interface PackageMetadata {
  readonly peerDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
}

const packageMetadata: PackageMetadata = packageJson

const entrypoints = new Set([
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

function getEntrypointsFromInput(input: ReadonlySet<string>) {
  return Object.fromEntries(
    Array.from(input).map(value => {
      const relativePath = path.relative('src', value)
      return [path.join(path.dirname(relativePath), path.basename(relativePath, path.extname(relativePath))), value]
    }),
  )
}

const dependencies = [
  ...Object.keys(packageMetadata.peerDependencies ?? {}),
  ...Object.keys(packageMetadata.dependencies ?? {}),
  ...Object.keys(packageMetadata.devDependencies ?? {}),
].map(name => {
  return new RegExp(`^${name}(/.*)?`)
})

const external = [
  // Exclude package dependencies
  ...dependencies,
  // Exclude Node.js built-in modules
  /node:.*/,
]

const input = {
  ...getEntrypointsFromInput(entrypoints),
  // "./test-helpers"
  'test-helpers': 'src/utils/test-helpers.tsx',
}

export default defineConfig([
  // ESM
  {
    input,
    plugins: [
      babel({
        include: /\.(?:js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
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
              sources: (filepath: string) => isSupported(filepath),
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
        postcssModulesOptions: {
          generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
        },
      }),
      preserveDirectives(),
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
    external,
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
  // TypeScript declarations
  {
    input,
    external,
    plugins: [
      dts({
        emitDtsOnly: true,
        oxc: false,
        sourcemap: false,
        tsconfig: './tsconfig.build.json',
      }),
    ],
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
])
