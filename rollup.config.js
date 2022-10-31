import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import glob from 'fast-glob'
import {terser} from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import packageJson from './package.json'

const input = new Set([
  // "exports"
  // "."
  'src/index.ts',

  // "./drafts"
  'src/drafts/index.ts',

  // "./deprecated"
  'src/deprecated/index.ts',

  // Make sure all members are exported
  'src/constants.ts',

  ...glob.sync(
    [
      // "./lib-esm/hooks/*"
      'src/hooks/*',

      // "./lib-esm/polyfills/*"
      'src/polyfills/*',

      // "./lib-esm/utils/*"
      'src/utils/*'
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
        'src/utils/test-matchers.tsx'
      ]
    }
  )
])

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const ESM_ONLY = new Set(['@github/combobox-nav', '@github/markdown-toolbar-element', '@github/paste-markdown'])
const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {})
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
}

const baseConfig = {
  input: Array.from(input),
  plugins: [
    // Note: it's important that the babel-plugin-preval is loaded first
    // to work as-intended
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
            modules: false
          }
        ]
      ],
      plugins: [
        'macros',
        'preval',
        'add-react-displayname',
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        [
          'babel-plugin-transform-replace-expressions',
          {
            replace: {
              __DEV__: "process.env.NODE_ENV !== 'production'"
            }
          }
        ]
      ]
    }),
    commonjs({
      extensions
    }),
    resolve({
      extensions
    })
  ]
}

export default [
  // ESM
  {
    ...baseConfig,
    external: dependencies.map(createPackageRegex),
    output: {
      dir: 'lib-esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  },

  // CommonJS
  {
    ...baseConfig,
    external: dependencies.filter(name => !ESM_ONLY.has(name)).map(createPackageRegex),
    output: {
      dir: 'lib',
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'auto'
    }
  },

  // Bundles
  {
    ...baseConfig,
    input: 'src/index.ts',
    external: ['styled-components', 'react', 'react-dom'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      ...baseConfig.plugins,
      terser(),
      visualizer({sourcemap: true})
    ],
    output: ['esm', 'umd'].map(format => ({
      file: `dist/browser.${format}.js`,
      format,
      sourcemap: true,
      name: 'primer',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'styled-components': 'styled'
      }
    }))
  }
]
