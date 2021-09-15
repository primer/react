const fs = require('fs')
const {relative} = require('path')
const globby = require('globby')
const docgen = require('react-docgen-typescript')
const {Table} = require('console-table-printer')

const componentPaths = globby.sync([
  '../src/**/*.tsx',
  '!../src/__tests__',
  '!../src/stories',
  '!../src/hooks',
  '!../src/utils'
])

const data = docgen.parse(componentPaths, {
  savePropValueAsString: true,
  propFilter: prop => {
    if (prop.declarations !== undefined && prop.declarations.length > 0) {
      const hasPropAdditionalDescription = prop.declarations.find(declaration => {
        return !declaration.fileName.includes('node_modules')
      })
      return Boolean(hasPropAdditionalDescription)
    }
    return true
  }
})

const table = new Table()
componentPaths.forEach(path => {
  const doc = data.find(doc => relative(process.cwd(), doc.filePath) === path)
  if (path.includes('AvatarStack')) console.log(doc)

  const docs = doc
  const props = doc?.props
  const displayName = doc?.displayName

  table.addRow(
    {path: path.replace('../src/', ''), docs: docs ? '✓' : '✕', props: props ? '✓' : '✕', displayName},
    {color: props ? 'green' : docs ? 'yellow' : 'red'}
  )
})
table.printTable()
