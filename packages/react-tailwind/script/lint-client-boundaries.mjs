import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import glob from 'fast-glob'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = glob.sync('src/**/*.{ts,tsx}', {
  absolute: true,
  cwd: packageDirectory,
  ignore: ['**/*.d.ts', '**/*.stories.*', '**/*.storyHelpers.*', '**/*.test.*', '**/test-setup.ts'],
})
// Matches `useThing(`, `React.useThing(`, and `createContext(`, including calls
// with explicit type arguments such as `useRef<HTMLElement>(`.
const clientRuntimePattern = /\b(?:React\.)?(?:createContext|use[A-Z][A-Za-z0-9]*)\s*(?:<[^()]*>\s*)?\(/
const failures = files.filter(filepath => {
  const source = fs.readFileSync(filepath, 'utf8')
  return clientRuntimePattern.test(source) && !/^['"]use client['"]/.test(source)
})
// A directive is only honored as the first statement; anywhere else it is a no-op expression.
const misplacedDirectives = glob
  .sync('src/**/*.{ts,tsx}', {absolute: true, cwd: packageDirectory})
  .filter(filepath => /\n;?\(?['"]use client['"]\)?\s*;?\s*(?:\n|$)/.test(fs.readFileSync(filepath, 'utf8')))

if (failures.length > 0 || misplacedDirectives.length > 0) {
  for (const filepath of failures) {
    // eslint-disable-next-line no-console
    console.error(`${path.relative(packageDirectory, filepath)} uses client-only React APIs without 'use client'.`)
  }
  for (const filepath of misplacedDirectives) {
    // eslint-disable-next-line no-console
    console.error(
      `${path.relative(packageDirectory, filepath)} has a 'use client' directive after the first statement.`,
    )
  }
  process.exitCode = 1
} else {
  // eslint-disable-next-line no-console
  console.log(`Client boundaries cover all ${files.length} runtime files.`)
}
