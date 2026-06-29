import babel from '@rolldown/plugin-babel'
import {defineConfig, RolldownMagicString as MagicString, type TransformPluginContext} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import packageJson from './package.json' with {type: 'json'}

type Program = ReturnType<TransformPluginContext['parse']>

interface PackageMetadata {
  readonly peerDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
}

const packageMetadata: PackageMetadata = packageJson

const dependencies = [
  ...Object.keys(packageMetadata.peerDependencies ?? {}),
  ...Object.keys(packageMetadata.dependencies ?? {}),
  ...Object.keys(packageMetadata.devDependencies ?? {}),
]

function createPackageRegex(name: string) {
  return new RegExp(`^${name}(/.*)?`)
}

const external = dependencies.map(createPackageRegex)

const declarationInput = {
  index: 'src/index.tsx',
  sx: 'src/sx.ts',
  'theme-get': 'src/theme-get.ts',
  'styled-props': 'src/styled-props.ts',
  polymorphic: 'src/polymorphic.ts',
  'components/BaseStyles': 'src/components/BaseStyles.tsx',
  'components/FeatureFlaggedTheming': 'src/components/FeatureFlaggedTheming.tsx',
  'components/ThemeContext': 'src/components/ThemeContext.ts',
  'components/ThemeProvider': 'src/components/ThemeProvider.tsx',
  'components/useFeatureFlaggedTheme': 'src/components/useFeatureFlaggedTheme.ts',
  'components/useTheme': 'src/components/useTheme.ts',
}

function hasClientDirective(ast: Program) {
  for (const node of ast.body) {
    if (node.type !== 'ExpressionStatement') {
      continue
    }

    if (node.directive === 'use client') {
      return true
    }
  }

  return false
}

export default defineConfig([
  {
    input: ['src/index.tsx'],
    external,
    plugins: [
      babel({
        presets: ['@babel/preset-typescript', ['@babel/preset-react', {runtime: 'automatic'}]],
        plugins: ['babel-plugin-styled-components'],
        include: /\.(?:ts|tsx)$/,
      }),
      /**
       * This custom Rolldown plugin allows us to preserve directives in source
       * code, such as "use client", in order to support React Server Components.
       *
       * The source for this plugin is inspired by:
       * https://github.com/Ephem/rollup-plugin-preserve-directives
       */
      {
        name: 'preserve-directives',
        transform(code) {
          const ast = this.parse(code)

          if (hasClientDirective(ast)) {
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
              const moduleInfo = this.getModuleInfo(moduleId)
              if (moduleInfo === null) {
                continue
              }

              if (moduleInfo.meta.hasClientDirective) {
                chunkHasClientDirective = true
                break
              }
            }

            if (chunkHasClientDirective) {
              const ast = this.parse(code)
              if (hasClientDirective(ast)) {
                return null
              }

              const transformed = new MagicString(code)
              transformed.prepend(`"use client";\n`)
              return {
                code: transformed.toString(),
                map: null,
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
    input: declarationInput,
    external,
    plugins: [
      dts({
        emitDtsOnly: true,
        sourcemap: true,
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
