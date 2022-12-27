'use strict'

// Script to migrate prop documentation from .mdx files to .doc.json files

const glob = require('fast-glob')
const fs = require('fs')

// Get all code files
const codeFiles = glob
  .sync('src/**/[A-Z]*.tsx')
  // Filter out tests and stories
  .filter(filePath => !filePath.includes('.test.') && !filePath.includes('.stories.'))

// Get all component mdx files
const mdxFiles = glob.sync('docs/content/**/[A-Z]*.{md,mdx}')

const components = mdxFiles.map(mdxPath => {
  const name = mdxPath.split('/').pop()?.split('.')[0]
  const mdxContent = fs.readFileSync(mdxPath, 'utf-8')
  const codePath = codeFiles.find(codePath => codePath.endsWith(`/${name}.tsx`))
  return {
    name,
    mdxPath,
    mdxContent,
    codePath,
  }
})

console.log(components)
