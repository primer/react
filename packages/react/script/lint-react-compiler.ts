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
const repositoryDirectory = path.resolve(packageDirectory, '../..')

// When CHANGED_FILES is set (CI PR mode), only check the files changed in the PR.
// Otherwise fall back to checking all migrated files.
const changedFilesEnv = process.env.CHANGED_FILES
const changedFilePaths = changedFilesEnv ? changedFilesEnv.split('\n').filter(Boolean) : null

if (changedFilePaths !== null) {
  const filesSet = new Set(files)
  const relevantFiles = changedFilePaths
    .map(changedFile => path.resolve(repositoryDirectory, changedFile))
    .filter(changedFile => filesSet.has(changedFile))

  if (relevantFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No changed files overlap with @primer/react package. Skipping React Compiler check.')
  } else {
    const results = relevantFiles.map(checkCompilerFile)
    const migratedFailures = results.filter(
      (result): result is CompilerFailure => !result.ok && isSupported(result.filepath),
    )
    const nonMigratedFailures = results.filter(
      (result): result is CompilerFailure => !result.ok && !isSupported(result.filepath),
    )

    if (migratedFailures.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `React Compiler failed for ${migratedFailures.length} migrated file${migratedFailures.length === 1 ? '' : 's'}:\n`,
      )

      for (const failure of migratedFailures) {
        const relativePath = path.relative(packageDirectory, failure.filepath)

        for (const error of failure.errors) {
          if (process.env.GITHUB_ACTIONS === 'true') {
            writeGitHubAnnotation('error', path.relative(repositoryDirectory, failure.filepath), error)
          }

          const line = getLocationLine(error.location)
          const location = line === undefined ? relativePath : `${relativePath}:${line}`

          // eslint-disable-next-line no-console
          console.error(`- ${location} ${formatReason(error.reason)}`)
        }
      }

      process.exitCode = 1
    }

    if (nonMigratedFailures.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `\nReact Compiler found issues in ${nonMigratedFailures.length} not-yet-migrated file${nonMigratedFailures.length === 1 ? '' : 's'}:\n`,
      )

      for (const failure of nonMigratedFailures) {
        const relativePath = path.relative(packageDirectory, failure.filepath)

        for (const error of failure.errors) {
          if (process.env.GITHUB_ACTIONS === 'true') {
            writeGitHubAnnotation(
              'notice',
              path.relative(repositoryDirectory, failure.filepath),
              error,
              getMigrationSuggestion(relativePath),
            )
          }

          const line = getLocationLine(error.location)
          const location = line === undefined ? relativePath : `${relativePath}:${line}`

          // eslint-disable-next-line no-console
          console.log(`- ${location} ${formatReason(error.reason)}`)
          // eslint-disable-next-line no-console
          console.log(`  Suggestion: ${getMigrationSuggestion(relativePath)}`)
        }
      }
    }
  }
} else {
  // Fallback: check all migrated files for compiler errors
  const migratedFiles = files.filter(isSupported)
  const failures = migratedFiles.map(checkCompilerFile).filter((result): result is CompilerFailure => !result.ok)

  if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`React Compiler failed for ${failures.length} migrated file${failures.length === 1 ? '' : 's'}:\n`)

    for (const failure of failures) {
      const relativePath = path.relative(packageDirectory, failure.filepath)

      for (const error of failure.errors) {
        if (process.env.GITHUB_ACTIONS === 'true') {
          writeGitHubAnnotation('error', path.relative(repositoryDirectory, failure.filepath), error)
        }

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
}

function getMigrationSuggestion(relativePath: string): string {
  return `To migrate ${relativePath} to React Compiler, remove it from the exclusion list in script/react-compiler.mjs and fix the compiler errors above.`
}

function formatReason(reason: string): string {
  return reason.replaceAll('\n', ' ')
}

function writeGitHubAnnotation(level: 'error' | 'notice', filepath: string, error: CheckError, message?: string): void {
  const properties = [`file=${escapeWorkflowProperty(filepath)}`, 'title=React Compiler']
  const line = getLocationLine(error.location)
  const column = getLocationColumn(error.location)

  if (line !== undefined) {
    properties.push(`line=${line}`)
  }

  if (column !== undefined) {
    properties.push(`col=${column}`)
  }

  const detail = message ? `${error.reason}\n${message}` : error.reason

  // eslint-disable-next-line no-console
  console.log(`::${level} ${properties.join(',')}::${escapeWorkflowCommand(detail)}`)
}

function escapeWorkflowCommand(value: string): string {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
}

function escapeWorkflowProperty(value: string): string {
  return escapeWorkflowCommand(value).replaceAll(':', '%3A').replaceAll(',', '%2C')
}

function getLocationLine(location: CheckError['location']): number | undefined {
  if (location === null || typeof location !== 'object' || !('start' in location)) {
    return undefined
  }

  return location.start.line
}

function getLocationColumn(location: CheckError['location']): number | undefined {
  if (location === null || typeof location !== 'object' || !('start' in location)) {
    return undefined
  }

  return location.start.column + 1
}

function checkCompilerFile(filepath: string): CheckResult & {filepath: string} {
  try {
    return {
      filepath,
      ...checkFile(filepath, fs.readFileSync(filepath, 'utf8')),
    }
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error)
    return {
      filepath,
      ok: false,
      errors: [{location: null, reason}],
    }
  }
}
