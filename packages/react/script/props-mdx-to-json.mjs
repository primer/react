'use strict'

// Temporary script to migrate React component metadata
// from .mdx files to .doc.json files.

// TODO: Remove this script after the migration is complete.

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
import {snakeCase} from 'change-case'
import path from 'node:path'

const srcMap = new Map([
  ['docs/content/ActionList.mdx', 'src/ActionList/List.tsx'],
  ['docs/content/deprecated/ActionList.mdx', 'src/deprecated/ActionList/List.tsx'],
  ['docs/content/deprecated/Buttons.mdx', 'src/deprecated/Button/Button.tsx'],
  ['docs/content/drafts/UnderlineNav2.mdx', 'src/UnderlineNav2/UnderlineNav.tsx'],
])

// Get all source code files
const srcFiles = glob
  .sync('src/**/[A-Z]*.tsx')
  // Filter out tests and stories
  .filter(filePath => !filePath.includes('.test.') && !filePath.includes('.stories.'))

// Get all component mdx files
const mdxFiles = glob
  .sync('docs/content/**/[A-Z]*.{md,mdx}')
  // Filter out deprecated components for now
  .filter(file => !file.includes('/deprecated/'))

const components = mdxFiles.map(mdxPath => {
  // Get the component name from the file name
  const name = mdxPath.split('/').pop()?.split('.')[0]

  const id = snakeCase(mdxPath.replace('docs/content/', '').replace(/.mdx?/, ''))

  // Find the corresponding source code file
  const srcPath = srcFiles.find(srcPath => srcPath.endsWith(`/${name}.tsx`))

  // Read the contents of the MDX file
  const mdxContent = fs.readFileSync(mdxPath, 'utf-8')

  // Parse the MDX file
  const ast = fromMarkdown(mdxContent, {
    extensions: [mdxjs(), frontmatter(['yaml'])],
    mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown(['yaml'])],
  })

  // Get the status and a11yReviewed flag from the frontmatter
  const {status, a11yReviewed = false} = parseYaml(find(ast, {type: 'yaml'}).value ?? '')

  // Get prop data by parsing usage of the <PropsTable> component
  const allComponentProps = flatFilter(ast, {type: 'mdxJsxFlowElement', name: 'PropsTable'})?.children.map(node => {
    const name = toString(findBefore(ast, find(ast, node), {type: 'heading', depth: 3}))

    const props =
      flatFilter(node, {type: 'mdxJsxFlowElement', name: 'PropsTableRow'})?.children.map(node => {
        const name = node.attributes.find(attr => attr.name === 'name')?.value
        const type = jsxToMd(node.attributes.find(attr => attr.name === 'type')?.value)
          .replace(/`/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\[([^)]+)\]\([^)]*\)/, '$1')
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
      }) ?? []

    let passthrough

    // If the component has an `sx` prop, add it to the list of props
    const sxPropRow = find(node, {type: 'mdxJsxFlowElement', name: 'PropsTableSxRow'})

    if (sxPropRow) {
      props.push({name: 'sx', type: 'SystemStyleObject'})
    }

    // If the component has a `ref` prop, add it to the list of props
    const refPropRow = find(node, {type: 'mdxJsxFlowElement', name: 'PropsTableRefRow'})

    if (refPropRow) {
      const refType = jsxToMd(refPropRow.attributes.find(attr => attr.name === 'refType')?.value)

      props.push({name: 'ref', type: `React.RefObject<${refType}>`})
    }

    // If the component has am `as` prop, add it to the list of props
    const asPropRow = find(node, {type: 'mdxJsxFlowElement', name: 'PropsTableAsRow'})

    if (asPropRow) {
      const defaultElementType = jsxToMd(asPropRow.attributes.find(attr => attr.name === 'defaultElementType')?.value)
      const isComponent = defaultElementType[0].toUpperCase() === defaultElementType[0]
      props.push({
        name: 'as',
        type: 'React.ElementType',
        defaultValue: isComponent ? defaultElementType : `"${defaultElementType}"`,
      })
    }

    const passthroughRow = find(node, {type: 'mdxJsxFlowElement', name: 'PropsTablePassthroughPropsRow'})

    if (passthroughRow) {
      const element = jsxToMd(passthroughRow.attributes.find(attr => attr.name === 'elementName')?.value)
      const url = jsxToMd(passthroughRow.attributes.find(attr => attr.name === 'passthroughPropsLink')?.value)
        .replace(/^.*\(/, '')
        .replace(/\)$/, '')

      passthrough = {element, url}
    }

    const basePropRows = find(node, {type: 'mdxJsxFlowElement', name: 'PropsTableBasePropRows'})

    if (basePropRows) {
      const refType = jsxToMd(basePropRows.attributes.find(attr => attr.name === 'refType')?.value)
      const elementType = jsxToMd(basePropRows.attributes.find(attr => attr.name === 'elementType')?.value)
      const passthroughPropsLink = jsxToMd(
        basePropRows.attributes.find(attr => attr.name === 'passthroughPropsLink')?.value,
      )
        .replace(/^.*\(/, '')
        .replace(/\)$/, '')
        .trim()
      const isPolymorphic = jsxToMd(basePropRows.attributes.find(attr => attr.name === 'isPolymorphic')?.value)

      if (refType) {
        props.push({name: 'ref', type: `React.RefObject<${refType}>`})
      }

      if (elementType) {
        passthrough = {element: elementType, url: passthroughPropsLink}
      }

      if (isPolymorphic !== false && isPolymorphic !== undefined ? true : undefined) {
        const isComponent = elementType[0].toUpperCase() === elementType[0]
        props.push({
          name: 'as',
          type: 'React.ElementType',
          defaultValue: isComponent ? elementType : `"${elementType}"`,
        })
      }

      props.push({name: 'sx', type: 'SystemStyleObject'})
    }

    return {name, props, passthrough}
  })

  // Separate the props for the current component from the props for subcomponents
  const props = allComponentProps?.find(component => component.name === name)?.props ?? []
  const passthrough = allComponentProps?.find(component => component.name === name)?.passthrough
  const subcomponents = allComponentProps?.filter(component => component.name !== name) ?? []

  return {
    id,
    name,
    mdxPath,
    mdxContent,
    srcPath,
    status: status.toLowerCase(),
    a11yReviewed,
    stories: [],
    props,
    passthrough,
    subcomponents,
  }
})

const componentsWithoutProps = components.filter(component => component.props.length === 0)

const componentsWithoutSrcPath = components.filter(component => !component.srcPath && !srcMap.has(component.mdxPath))

console.log(
  'Components without props',
  componentsWithoutProps.map(component => component.name),
)

console.log(
  'Components wihout props (count)',
  `${componentsWithoutProps.length} / ${components.length}`,
  `${((componentsWithoutProps.length / components.length) * 100).toFixed(2)}%`,
)

console.log(
  'Components without srcPath',
  componentsWithoutSrcPath.map(component => component.mdxPath),
)

for (const component of components) {
  const docPath =
    component.srcPath?.replace('.tsx', '.docs.json') ||
    `${srcMap.get(component.mdxPath)?.replace(/\/[^/]*$/, '')}/${component.name}.docs.json`

  let existingFile = {}

  if (fs.existsSync(docPath)) {
    existingFile = JSON.parse(fs.readFileSync(docPath, 'utf-8'))
  }

  const newFile = {
    ...existingFile,
    id: component.id,
    name: component.name,
    status: component.status,
    a11yReviewed: component.a11yReviewed,
    stories: component.stories.length > 0 ? component.stories : existingFile.stories || [],
    props: component.props.length > 0 ? component.props : existingFile.props || [],
    subcomponents: component.subcomponents.length > 0 ? component.subcomponents : existingFile.subcomponents || [],
  }

  fs.writeFileSync(docPath, JSON.stringify(newFile, null, 2))

  const relativeDocPath = path.relative(component.mdxPath, docPath).replace(/^\.\.\//, '')

  if (component.props.length > 0 && !component.mdxContent.includes(`import data from '${relativeDocPath}'`)) {
    let newMdxContent = component.mdxContent.replace(/\n---\n/, `\n---\n\nimport data from '${relativeDocPath}'\n`)

    const propsHeadingIndex = newMdxContent.indexOf('## Props')
    const nextHeadingIndex = newMdxContent.indexOf('\n## ', propsHeadingIndex + 1)

    newMdxContent = `${newMdxContent.slice(
      0,
      propsHeadingIndex,
    )}## Props\n\n<ComponentProps data={data} />\n\n${newMdxContent.slice(nextHeadingIndex)}`

    fs.writeFileSync(component.mdxPath, newMdxContent)
  }
}

// Helper functions

/** Convert JSX string to markdown string */
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
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}
