import {existsSync, readdirSync} from 'node:fs'
import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import {defineConfig} from 'rolldown'
import {dts} from 'rolldown-plugin-dts'
import {preserveDirectives} from 'rolldown-plugin-preserve-directives'
import packageJson from './package.json' with {type: 'json'}

interface PackageMetadata {
  readonly peerDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
}

const packageMetadata: PackageMetadata = packageJson
const external = [
  ...Object.keys(packageMetadata.peerDependencies ?? {}),
  ...Object.keys(packageMetadata.dependencies ?? {}),
  ...Object.keys(packageMetadata.devDependencies ?? {}),
].map(name => new RegExp(`^${name}(/.*)?`))

const componentsDirectory = path.resolve(import.meta.dirname, 'src/components')
const componentEntries = Object.fromEntries(
  readdirSync(componentsDirectory, {withFileTypes: true})
    .filter(entry => entry.isDirectory() && existsSync(path.join(componentsDirectory, entry.name, 'index.ts')))
    .map(entry => [`components/${entry.name}/index`, `src/components/${entry.name}/index.ts`]),
)

const input = {
  index: 'src/index.ts',
  ...componentEntries,
}

export default defineConfig([
  {
    input,
    external,
    plugins: [
      babel({
        include: /\.(?:ts|tsx)$/,
        exclude: /node_modules/,
        presets: ['@babel/preset-typescript', ['@babel/preset-react', {runtime: 'automatic'}]],
        plugins: [['babel-plugin-react-compiler', {target: '19'}]],
      }),
      preserveDirectives(),
    ],
    onwarn(warning, defaultHandler) {
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
