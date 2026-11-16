import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import glob from 'fast-glob'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = glob.sync('src/components/**/*.tsx', {
  absolute: true,
  cwd: packageDirectory,
  ignore: ['**/*.d.ts', '**/*.stories.*', '**/*.storyHelpers.*', '**/*.test.*'],
})

// A parent that identifies a child by role must also accept an element prop of that name, so a
// consumer whose own component wraps the part is never blocked by identity matching.
const resolveRegionsCall = /resolveRegions\(\s*([\s\S]*?)\n\s*\)/g
const regionEntry = /^\s{4,}(\w+):\s*\{([^}]*)\}/gm
const regionPropsDeclaration = /RegionProps<([^>]+)>/g

const failures = []

for (const filepath of files) {
  const source = fs.readFileSync(filepath, 'utf8')
  if (!source.includes('resolveRegions(')) continue

  const declared = new Set()
  for (const [, names] of source.matchAll(regionPropsDeclaration)) {
    for (const name of names.split('|')) declared.add(name.trim().replace(/['"]/g, ''))
  }

  const relative = path.relative(packageDirectory, filepath)

  for (const [call, specsBlock] of source.matchAll(resolveRegionsCall)) {
    // Regions kept in place are detection-only, and a call with no overrides argument is an
    // internal helper whose caller owns the props.
    const hasOverrides = /\}\s*,\s*\{/.test(call)
    if (!hasOverrides) continue

    for (const [, name, body] of specsBlock.matchAll(regionEntry)) {
      if (/keep:\s*true/.test(body)) continue
      if (declared.has(name)) continue
      failures.push(`${relative} resolves the \`${name}\` region but does not declare it in RegionProps<…>.`)
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    // eslint-disable-next-line no-console
    console.error(failure)
  }
  process.exitCode = 1
} else {
  // eslint-disable-next-line no-console
  console.log('Region props cover every resolved region.')
}
