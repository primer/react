import babel from '@rolldown/plugin-babel'
import {defineConfig} from 'rolldown'
import {preserveDirectives} from 'rolldown-plugin-preserve-directives'
import {dts} from 'rolldown-plugin-dts'
import packageJson from './package.json' with {type: 'json'}

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
