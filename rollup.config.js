import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import glob from 'fast-glob'
import {visualizer} from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import packageJson from './package.json'

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
  '@lit-labs/react',
])
const dependencies = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
]

function createPackageRegex(name) {
  return new RegExp(`^${name}(/.*)?`)
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
    postcss({
      extract: 'components.css',
      autoModules: false,
      modules: {generateScopedName: 'prc_[local]_[hash:base64:5]'},
      // plugins are defined in postcss.config.js
    }),
  ],
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
      ...baseConfig.plugins,
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
