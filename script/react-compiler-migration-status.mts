import path from 'node:path'
import fs from 'node:fs'
import {files as compilerFiles, notMigrated as notMigratedFiles} from '../packages/react/script/react-compiler.mjs'

const directory = path.resolve(import.meta.dirname, '..')
const files = compilerFiles.map(filepath => {
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

let totalSize = 0

for (const {size} of files) {
  totalSize += size
}

let migratedSize = 0

for (const {size} of migrated) {
  migratedSize += size
}

console.log(`
# React Compiler Migration

This report tracks our status migrating Primer React files to work with React Compiler.

## Status

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor((migrated.length / files.length) * 100)})

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

<details>
<summary>View migrated files</summary>

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
