/* eslint-disable no-console */
const glob = require('fast-glob')
const fs = require('node:fs')

const introduction = `# Docs migration tracking

We're moving towards a [unified IA](https://github.com/github/primer/issues/1354) for Primer docs that will combine React and Rails component documentation. To implement this unified IA, we need to access Primer React component metadata from outside the primer/react repo.

The first step to making Primer React component metadata more accessible is to move the prop metadata currently stored in MDX files into structured JSON files per component (example: [TreeView](https://github.com/primer/react/blob/main/src/TreeView/TreeView.docs.json)). These component JSON files are automatically compiled into a file called [generated/components.json](https://github.com/primer/react/blob/main/generated/components.json) that can be imported from outside the primer/react repo.

This script tracks our progress as we move the source of truth for component metadata from MDX files to JSON files.
`

console.log(introduction)

const mdxFiles = glob.sync('docs/content/**/[A-Z]*.{mdx,md}')

const migratedMdxFiles = mdxFiles.filter(file => {
  const content = fs.readFileSync(file, 'utf8')

  // We consider an .mdx file "migrated" if it imports a corresponding .docs.json file
  return /import .* from ['"].*\.docs\.json['"]/.test(content)
})

console.log(`![Progress bar](https://geps.dev/progress/${Math.ceil((migratedMdxFiles.length / mdxFiles.length) * 100)})
`)

console.log(`## Migrated MDX files

${migratedMdxFiles.length} of ${mdxFiles.length} MDX files have corresponding JSON files.

${migratedMdxFiles.map(file => `- [x] [${file}](https://github.com/primer/react/blob/main/${file})`).join('\n')}
`)

console.log(`## Not-yet migrated MDX files

${mdxFiles.length - migratedMdxFiles.length} of ${mdxFiles.length} MDX files do not have corresponding JSON files.

${mdxFiles
  .filter(file => !migratedMdxFiles.includes(file))
  .map(file => `- [ ] [${file}](https://github.com/primer/react/blob/main/${file})`)
  .join('\n')}
`)
