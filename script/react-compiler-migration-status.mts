import path from 'node:path'
import fs from 'node:fs'
import {checkFile} from '@primer/react-compiler-check'
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
  let result
  try {
    result = checkFile(filepath, fs.readFileSync(filepath, 'utf8'))
  } catch (error) {
    return [
      {
        line: getErrorLine(error),
        reason: error instanceof Error ? error.message : String(error),
      },
    ]
  }

  if (result.ok) {
    return []
  }

  return result.errors.map(error => {
    return {
      line: getLocationLine(error.location),
      reason: error.reason,
    }
  })
}

function getLocationLine(location: {start: {line: number}} | null): number | null {
  return location?.start.line ?? null
}

function getErrorLine(error: unknown): number | null {
  if (error !== null && typeof error === 'object' && 'loc' in error) {
    const loc = error.loc

    if (loc !== null && typeof loc === 'object' && 'line' in loc && typeof loc.line === 'number') {
      return loc.line
    }
  }

  return null
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
