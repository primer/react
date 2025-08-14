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

// Uses `Box`
// Uses `BoxWithFallback`
// Uses sx (`SxProp` or `sx`)
// Uses styled

const box = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return contents.match(/Box(?!WithFallback)/)
})
const boxSize = box.reduce((acc, {size}) => acc + size, 0)

const boxWithFallback = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return contents.match(/BoxWithFallback/)
})
const boxWithFallbackSize = boxWithFallback.reduce((acc, {size}) => acc + size, 0)

const sx = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return contents.match(/SxProp/) || contents.match(/sx=/)
})
const sxSize = sx.reduce((acc, {size}) => acc + size, 0)

const styled = matches.filter(({filepath}) => {
  const contents = fs.readFileSync(filepath, 'utf8')
  return contents.match(/styled\./) || contents.match(/styled\(/)
})
const styledSize = styled.reduce((acc, {size}) => acc + size, 0)

const totalCount = matches.length
const totalSize = matches.reduce((acc, {size}) => acc + size, 0)

const notMigrated = new Set([...box, ...boxWithFallback, ...sx, ...styled].map(match => match.filepath))
const migrated = new Set()
let notMigratedSize = 0
let migratedSize = 0

for (const match of matches) {
  if (!notMigrated.has(match.filepath)) {
    migrated.add(match.filepath)
    migratedSize += match.size
  } else {
    notMigratedSize += match.size
  }
}

console.log(`# styled-components Migration

This report tracks our status migrating files from styled-components to CSS Modules.

## Status

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor((migrated.size / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor((migratedSize / totalSize) * 100)})

## Box

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((matches.length - box.length) / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - boxSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(box)}
</details>

## BoxWithFallback

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((matches.length - boxWithFallback.length) / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - boxWithFallbackSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(boxWithFallback)}
</details>

## sx

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((matches.length - sx.length) / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - sxSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(sx)}
</details>

## styled

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((matches.length - styled.length) / matches.length) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - styledSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(styled)}
</details>
`)

function getTable(collection: Array<{filepath: string; size: number}>): string {
  const rows = collection.sort((a, b) => b.size - a.size)
  let output = ''

  output += '| Filepath | Size (kB) |\n'
  output += '| :------- | :-------- |\n'

  for (const {filepath, size} of rows) {
    const relativePath = path.relative(directory, filepath)
    const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`
    output += `| ${link} | ${round(size / 1024)}kB |\n`
  }

  return output
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
