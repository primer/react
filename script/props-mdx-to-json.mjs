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
import flatFilter from 'unist-util-flat-filter'
import {toString} from 'mdast-util-to-string'
import {findBefore} from 'unist-util-find-before'

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

  // Parse the MDX file
  const ast = fromMarkdown(mdxContent, {
    extensions: [mdxjs(), frontmatter(['yaml'])],
    mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown(['yaml'])],
  })

  // Get the status and a11yReviewed flag from the frontmatter
  const {status, a11yReviewed = false} = parseYaml(find(ast, {type: 'yaml'}).value ?? '')

  // Parse props tables
  const propsTables = flatFilter(ast, {type: 'mdxJsxFlowElement', name: 'PropsTable'})?.children.map(node => {
    const name = toString(findBefore(ast, find(ast, node), {type: 'heading', depth: 3}))

    const props = flatFilter(node, {type: 'mdxJsxFlowElement', name: 'PropsTableRow'})?.children.map(node => {
      const name = node.attributes.find(attr => attr.name === 'name')?.value
      const type = jsxToMd(node.attributes.find(attr => attr.name === 'type')?.value).replace(/`/g, '')
      const description = jsxToMd(node.attributes.find(attr => attr.name === 'description')?.value)
      const defaultValue = jsxToMd(node.attributes.find(attr => attr.name === 'defaultValue')?.value)
      const required = node.attributes.find(attr => attr.name === 'required')?.value
      const deprecated = node.attributes.find(attr => attr.name === 'deprecated')?.value

      return {
        name,
        type,
        defaultValue,
        deprecated: deprecated !== false && deprecated !== undefined ? true : undefined,
        required: required !== false && required !== undefined ? true : undefined,
        description,
      }
    })

    // TODO: sx prop
    // TODO: ref prop
    // TODO: as prop
    // TODO: passthrough props

    return {name, props}
  })

  const props = propsTables?.find(propsTable => propsTable.name === name)?.props ?? []
  const subcomponents = propsTables?.filter(propsTable => propsTable.name !== name) ?? []

  return {
    mdxPath,
    codePath,
    name,
    status: status.toLowerCase(),
    a11yReviewed,
    stories: [],
    props,
    subcomponents,
  }
})

function jsxToMd(node) {
  if (typeof node === 'string') return node

  return toString(node)
    .replace(/<InlineCode>/g, '`')
    .replace(/<\/InlineCode>/g, '`')
    .replace(/<>/g, '')
    .replace(/<\/>/g, '')
    .replace(/\{' '\}/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/<Link href="(.+?)">(.+?)<\/Link>/g, '[$2]($1)')
    .replace(/<a href="(.+?)">(.+?)<\/a>/g, '[$2]($1)')
    .trim()
}

// Temporary: write the JSON to a file
fs.writeFileSync('docs.json', JSON.stringify(components, null, 2))
