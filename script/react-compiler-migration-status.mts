import path from 'node:path'
import fs from 'node:fs'
import {transformFileSync} from '@babel/core'
import type {TransformOptions} from '@babel/core'
import {CompilerError} from 'babel-plugin-react-compiler'
import type {PluginOptions, Logger, LoggerEvent} from 'babel-plugin-react-compiler'
import {files as compilerFiles, notMigrated as notMigratedFiles} from '../packages/react/script/react-compiler.mjs'

const directory = path.resolve(import.meta.dirname, '..')
interface CompilerFile {
  readonly filepath: string
  readonly size: number
}

interface CompilerFailure {
  readonly line: number | null
  readonly reason: string
}
type CompilerErrorDetail = CompilerError['details'][number]

type BabelReactPresetOptions = {
  readonly modules: false
  readonly runtime: 'automatic'
}
type BabelTransformPlugin = [string, PluginOptions | Record<string, never>] | string
type BabelTransformPreset = [string, BabelReactPresetOptions] | string
interface BabelTransformOptions extends TransformOptions {
  readonly presets: Array<BabelTransformPreset>
  readonly plugins: Array<BabelTransformPlugin>
}

const files: Array<CompilerFile> = compilerFiles.map(filepath => {
  const stats = fs.statSync(filepath)
  return {
    filepath,
    size: stats.size,
  }
})
const migrated = files.filter(({filepath}) => {
  return notMigratedFiles.indexOf(filepath) === -1
})
const notMigrated = notMigratedFiles.map(filepath => {
  const stats = fs.statSync(filepath)
  return {
    filepath,
    size: stats.size,
  }
})
const notMigratedReports = notMigrated.map(file => {
  return {
    ...file,
    failures: getCompilerFailures(file.filepath),
  }
})

let totalSize = 0

for (const {size} of files) {
  totalSize += size
}

let migratedSize = 0

for (const {size} of migrated) {
  migratedSize += size
}

write(`
# React Compiler Migration

This report tracks our status migrating Primer React files to work with React Compiler.

## Status

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor((migrated.length / files.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor((migratedSize / totalSize) * 100)})
`)

write(`
## Not Migrated (${notMigratedReports.length})

| Filepath | Size (kB) | Compiler errors |
| :------- | :-------- | :-------------- |`)

for (const {filepath, size, failures} of notMigratedReports) {
  const relativePath = path.relative(directory, filepath)
  const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`
  write(`| ${link} | ${round(size / 1024)}kB | ${formatCompilerFailures(failures)} |`)
}

write(`## Migrated (${migrated.length})

<details>
<summary>View migrated files</summary>

| Filepath | Size (kB) |
| :------- | :-------- |`)

for (const {filepath, size} of migrated) {
  const relativePath = path.relative(directory, filepath)
  const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`
  write(`| ${link} | ${round(size / 1024)}kB |`)
}

write(`\n</details>`)

function write(value: string): void {
  process.stdout.write(`${value}\n`)
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function getCompilerFailures(filepath: string): Array<CompilerFailure> {
  const failures: Array<CompilerFailure> = []
  const logger: Logger = {
    logEvent(_filename: string | null, event: LoggerEvent) {
      if (event.kind === 'CompileError') {
        addCompilerFailure(failures, formatCompilerError(event))
      }

      if (event.kind === 'CompileSkip') {
        addCompilerFailure(failures, {
          line: getLocationLine(event.loc ?? event.fnLoc),
          reason: event.reason,
        })
      }
    },
  }

  try {
    transformFileSync(filepath, getBabelTransformOptions(logger))
  } catch (error: unknown) {
    if (!(error instanceof CompilerError)) {
      throw error
    }

    for (const detail of error.details) {
      addCompilerFailure(failures, formatCompilerErrorDetail(detail))
    }
  }

  return failures
}

function getBabelTransformOptions(logger: Logger): BabelTransformOptions {
  return {
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
          panicThreshold: 'all_errors',
          logger,
        },
      ],
      'macros',
      'add-react-displayname',
      'dev-expression',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
    ],
  }
}

function formatCompilerError(event: Extract<LoggerEvent, {kind: 'CompileError'}>): CompilerFailure {
  return formatCompilerErrorDetail(event.detail)
}

function formatCompilerErrorDetail(detail: CompilerErrorDetail): CompilerFailure {
  return {
    line: getLocationLine(detail.primaryLocation()),
    reason: detail.reason,
  }
}

function addCompilerFailure(failures: Array<CompilerFailure>, failure: CompilerFailure): void {
  const hasFailure = failures.some(existingFailure => {
    return existingFailure.line === failure.line && existingFailure.reason === failure.reason
  })

  if (!hasFailure) {
    failures.push(failure)
  }
}

function getLocationLine(location: {start: {line: number}} | null): number | null {
  return location?.start.line ?? null
}

function formatCompilerFailures(failures: Array<CompilerFailure>): string {
  if (failures.length === 0) {
    return 'No compiler errors reported'
  }

  return failures.map(formatCompilerFailure).join('; ')
}

function formatCompilerFailure(failure: CompilerFailure): string {
  const location = failure.line === null ? '' : `L${failure.line}: `
  return escapeTableCell(`${location}${failure.reason}`)
}

function escapeTableCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ')
}
