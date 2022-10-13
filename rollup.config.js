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
const external = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {})
]
function isExternal(external) {
  return id => {
    // Match on import paths that are the same as dependencies listed in
    // `package.json`
    const match = external.find(pkg => {
      return id === pkg
    })

    if (match) {
      return true
    }

    // In some cases, there may be a subpath import from a module which should
    // also be treated as external. For example:
    //
    // External: @primer/behaviors
    // Import: @primer/behaviors/utils
    return external.some(pkg => {
      // Include the / to not match imports like: @primer/behaviors-for-acme/utils
      return id.startsWith(`${pkg}/`)
    })
  }
}

const baseConfig = {
  input: Array.from(input),
  plugins: [
    // Note: it's important that the babel plugin is ordered first for plugins
    // like babel-plugin-preval to work as-intended
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
    commonjs(),
    resolve({
      extensions
    })
  ]
}

export default [
  // ESM
  {
    ...baseConfig,
    external: isExternal(external),
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
    external: isExternal(external),
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
