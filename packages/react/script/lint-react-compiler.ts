import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {check} from '@primer/react-compiler-check'
import type {CheckError} from '@primer/react-compiler-check'
import PQueue from 'p-queue'
import {files, isSupported} from './react-compiler.mjs'

interface CompilerFailure {
  readonly filepath: string
  readonly errors: Array<CheckError>
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const packageDirectory = path.resolve(dirname, '..')
const migratedFiles = files.filter(isSupported)
const queue = new PQueue({
  concurrency: 20,
})
const failures = (
  await Promise.all(
    migratedFiles.map(filepath => {
      return queue.add(() => {
        return checkFile(filepath)
      })
    }),
  )
).filter((failure): failure is CompilerFailure => failure !== null)

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

async function checkFile(filepath: string): Promise<CompilerFailure | null> {
  try {
    const result = await check(filepath, await fs.readFile(filepath, 'utf8'))

    if (result.ok) {
      return null
    }

    return {
      filepath,
      errors: result.errors,
    }
  } catch (error) {
    return {
      filepath,
      errors: [
        {
          location: null,
          reason: error instanceof Error ? error.message : String(error),
        },
      ],
    }
  }
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
