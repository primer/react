import path from 'node:path'
import fs from 'node:fs'
import glob from 'fast-glob'

const directory = path.resolve(import.meta.dirname, '..')
const matches = glob
  .sync('packages/react/src/**/*.{ts,tsx}', {
    cwd: directory,
    ignore: [
      '**/e2e/**',
      '**/node_modules/**',
      '**/.playwright/**',
      '**/lib/**',
      '**/dist/**',
      '**/lib-esm/**',
      '**/storybook-static/**',
      '**/.next/**',
      '**/*.test.{ts,tsx}',
      '**/*.types.test.{ts,tsx}',
      '**/*.module.css.d.ts',
    ],
  })
  .map(match => {
    const filepath = path.resolve(directory, match)
    const stats = fs.statSync(filepath)
    return {
      filepath,
      size: stats.size,
    }
  })
  .sort((a, b) => {
    return b.size - a.size
  })

const migrated = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return !hasStyledComponents(contents)
})

const notMigrated = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return hasStyledComponents(contents)
})

let totalSize = 0

for (const {size} of matches) {
  totalSize += size
}

let migratedSize = 0

for (const {size} of migrated) {
  migratedSize += size
}

console.log(`
# styled-components Migration

This report tracks our status migrating files from styled-components to CSS Modules.

## Status

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor((migrated.length / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor((migratedSize / totalSize) * 100)})
`)

console.log(`
## Not Migrated (${notMigrated.length})

| Filepath | Size (kB) |
| :------- | :-------- |`)

for (const {filepath, size} of notMigrated) {
  const relativePath = path.relative(directory, filepath)
  const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`
  console.log(`| ${link} | ${round(size / 1024)}kB |`)
}

console.log(`## Migrated (${migrated.length})

There are ${migrated.length} files that do not include styled-components in Primer React.

<details>
<summary>All files</summary>

| Filepath | Size (kB) |
| :------- | :-------- |`)

for (const {filepath, size} of migrated) {
  const relativePath = path.relative(directory, filepath)
  const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`
  console.log(`| ${link} | ${round(size / 1024)}kB |`)
}

console.log(`\n</details>`)

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function hasStyledComponents(contents: string): boolean {
  if (contents.match(/styled-components/)) {
    return true
  }

  if (contents.match(/SxProp/)) {
    return true
  }

  if (contents.match(/Box/)) {
    return true
  }

  if (contents.match(/BoxWithFallback/)) {
    return true
  }

  return false
}
