import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import glob from 'fast-glob'
import {checkFile} from '@primer/react-compiler-check'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = glob.sync('src/**/*.{ts,tsx}', {
  absolute: true,
  cwd: packageDirectory,
  ignore: ['**/*.d.ts', '**/*.stories.*', '**/*.test.*', '**/test-setup.ts'],
})
const failures = files
  .map(filepath => ({filepath, result: checkFile(filepath, fs.readFileSync(filepath, 'utf8'))}))
  .filter(({result}) => !result.ok)

if (failures.length > 0) {
  for (const {filepath, result} of failures) {
    for (const error of result.errors) {
      const line = error.location?.start.line
      const location = path.relative(packageDirectory, filepath)
      // eslint-disable-next-line no-console
      console.error(`${line === undefined ? location : `${location}:${line}`} ${error.reason}`)
    }
  }
  process.exitCode = 1
} else {
  // eslint-disable-next-line no-console
  console.log(`React Compiler passed for ${files.length} runtime files.`)
}
