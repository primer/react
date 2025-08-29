import path from 'node:path'
import fs from 'node:fs'
import babel from '@babel/core'
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
      '**/*.module.css.d.ts',
      '**/*.figma.tsx',
    ],
  })
  .map(match => {
    const filepath = path.resolve(directory, match)
    const ast = babel.parseSync(fs.readFileSync(filepath, 'utf8'), {
      parserOpts: {
        sourceType: 'module',
        plugins: [
          'typescript',
          // Language
          'jsx',
          // Proposal
          'classProperties',
          'classPrivateProperties',
          'classPrivateMethods',
          'decorators-legacy',
          'dynamicImport',
          'exportDefaultFrom',
          'exportNamespaceFrom',
          'importMeta',
          'nullishCoalescingOperator',
          'numericSeparator',
          'objectRestSpread',
          'optionalCatchBinding',
          'optionalChaining',
          'topLevelAwait',
        ],
      },
    })
    const stats = fs.statSync(filepath)
    const importSpecifiers: Array<{imported: string; local: string; source: string}> = []

    if (ast) {
      babel.traverse(ast, {
        ImportDeclaration(path) {
          for (const specifier of path.node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              importSpecifiers.push({
                imported: specifier.imported.type === 'Identifier' ? specifier.imported.name : specifier.imported.value,
                local: specifier.local.name,
                source: path.node.source.value,
              })
            } else if (specifier.type === 'ImportDefaultSpecifier') {
              importSpecifiers.push({
                imported: 'default',
                local: specifier.local.name,
                source: path.node.source.value,
              })
            }
          }
        },
      })
    }

    return {
      filepath,
      size: stats.size,
      importSpecifiers,
    }
  })
  .sort((a, b) => {
    return b.size - a.size
  })

const box = matches.filter(({importSpecifiers}) => {
  return importSpecifiers.some(specifier => {
    return specifier.imported === 'Box' || specifier.local === 'Box'
  })
})
const boxSize = box.reduce((acc, {size}) => acc + size, 0)

const boxWithFallback = matches.filter(({importSpecifiers}) => {
  return importSpecifiers.some(specifier => {
    return specifier.imported === 'BoxWithFallback' || specifier.local === 'BoxWithFallback'
  })
})
const boxWithFallbackSize = boxWithFallback.reduce((acc, {size}) => acc + size, 0)

const sx = matches.filter(({importSpecifiers}) => {
  return importSpecifiers.some(specifier => {
    return (
      specifier.imported === 'sx' ||
      specifier.local === 'sx' ||
      specifier.imported === 'SxProp' ||
      specifier.local === 'SxProp'
    )
  })
})
const sxSize = sx.reduce((acc, {size}) => acc + size, 0)

const styledComponents = matches.filter(({importSpecifiers}) => {
  return importSpecifiers.some(specifier => {
    return specifier.source.includes('styled-components')
  })
})
const styledComponentsSize = styledComponents.reduce((acc, {size}) => acc + size, 0)

const styledSystem = matches.filter(({importSpecifiers}) => {
  return importSpecifiers.some(specifier => {
    return specifier.source.includes('styled-system') || specifier.source.includes('@styled-system')
  })
})
const styledSystemSize = styledSystem.reduce((acc, {size}) => acc + size, 0)

const totalCount = matches.length
const totalSize = matches.reduce((acc, {size}) => acc + size, 0)

const notMigrated = new Set(
  [...box, ...boxWithFallback, ...sx, ...styledComponents, ...styledSystem].map(match => match.filepath),
)
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

![Status by file count](https://geps.dev/progress/${Math.floor((migrated.size / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor((migratedSize / totalSize) * 100)})

## Box (${box.length})

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((totalCount - box.length) / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - boxSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(box)}
</details>

## BoxWithFallback (${boxWithFallback.length})

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((totalCount - boxWithFallback.length) / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - boxWithFallbackSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(boxWithFallback)}
</details>

## sx (${sx.length})

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((totalCount - sx.length) / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - sxSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(sx)}
</details>

## styled-components (${styledComponents.length})

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((totalCount - styledComponents.length) / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - styledComponentsSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(styledComponents)}
</details>

## styled-system (${styledSystem.length})

**Status by file count**

![Status by file count](https://geps.dev/progress/${Math.floor(((totalCount - styledSystem.length) / totalCount) * 100)})

**Status by file size**

![Status by file size](https://geps.dev/progress/${Math.floor(((totalSize - styledSystemSize) / totalSize) * 100)})

<details>
<summary>Files</summary>

${getTable(styledSystem)}
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
