'use strict'

// Script to migrate prop documentation from .mdx files to .doc.json files

import glob from 'fast-glob'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatterFromMarkdown} from 'mdast-util-frontmatter'
import {mdxFromMarkdown} from 'mdast-util-mdx'
import {frontmatter} from 'micromark-extension-frontmatter'
import {mdxjs} from 'micromark-extension-mdxjs'
import fs from 'node:fs'
import find from 'unist-util-find'
import {parse as parseYaml} from 'yaml'

// Get all code files
const codeFiles = glob
  .sync('src/**/[A-Z]*.tsx')
  // Filter out tests and stories
  .filter(filePath => !filePath.includes('.test.') && !filePath.includes('.stories.'))

// Get all component mdx files
// const mdxFiles = glob.sync('docs/content/**/[A-Z]*.{md,mdx}')
const mdxFiles = ['docs/content/ActionList.mdx']

const components = mdxFiles.map(mdxPath => {
  const name = mdxPath.split('/').pop()?.split('.')[0]

  const mdxContent = fs.readFileSync(mdxPath, 'utf-8')

  const codePath = codeFiles.find(codePath => codePath.endsWith(`/${name}.tsx`))

  const ast = fromMarkdown(mdxContent, {
    extensions: [mdxjs(), frontmatter(['yaml'])],
    mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown(['yaml'])],
  })

  const {status} = parseYaml(find(ast, {type: 'yaml'}).value ?? '')

  return {
    name,
    status,
    mdxPath,
    // mdxContent,
    codePath,
  }
})

console.log(components)
