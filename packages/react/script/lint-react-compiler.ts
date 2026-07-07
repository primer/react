import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {checkFile} from '@primer/react-compiler-check'
import type {CheckError, CheckResult} from '@primer/react-compiler-check'
import {files, isSupported} from './react-compiler.mjs'

type CompilerFailure = Extract<CheckResult, {ok: false}> & {
  filepath: string
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const packageDirectory = path.resolve(dirname, '..')
const migratedFiles = files.filter(isSupported)
const failures = migratedFiles.map(checkCompilerFile).filter((result): result is CompilerFailure => !result.ok)

if (failures.length > 0) {
  // eslint-disable-next-line no-console
  console.error(`React Compiler failed for ${failures.length} migrated file${failures.length === 1 ? '' : 's'}:\n`)

  for (const failure of failures) {
    const relativePath = path.relative(packageDirectory, failure.filepath)

    for (const error of failure.errors) {
      const line = getLocationLine(error.location)
      const location = line === undefined ? relativePath : `${relativePath}:${line}`

      // eslint-disable-next-line no-console
      console.error(`- ${location} ${formatReason(error.reason)}`)
    }
  }

  process.exitCode = 1
} else {
  // eslint-disable-next-line no-console
  console.log(`React Compiler passed for ${migratedFiles.length} migrated files.`)
}

function formatReason(reason: string): string {
  return reason.replaceAll('\n', ' ')
}

function getLocationLine(location: CheckError['location']): number | undefined {
  if (location === null || typeof location !== 'object' || !('start' in location)) {
    return undefined
  }

  return location.start.line
}

function checkCompilerFile(filepath: string): CheckResult & {filepath: string} {
  return {
    filepath,
    ...checkFile(filepath, fs.readFileSync(filepath, 'utf8')),
  }
}
