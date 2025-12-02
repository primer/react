import {describe, test, expect} from 'vitest'
import ts from 'typescript'
import path from 'node:path'

const entrypoints: Array<
  [name: string, filepath: string, exports: Array<[name: string, deprecatedTag: boolean, deprecatedComment: boolean]>]
> = [
  ['@primer/styled-react', path.resolve(import.meta.dirname, '../index.tsx'), []],
  ['@primer/styled-react/deprecated', path.resolve(import.meta.dirname, '../deprecated.tsx'), []],
  ['@primer/styled-react/experimental', path.resolve(import.meta.dirname, '../experimental.tsx'), []],
]

const program = ts.createProgram(
  entrypoints.map(entrypoint => entrypoint[1]),
  {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
  },
)

for (const [, filepath, exports] of entrypoints) {
  const sourceFile = program.getSourceFile(filepath)

  ts.forEachChild(sourceFile!, node => {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) {
        const exportName = element.name.text
        // Check for JSDoc comments on the export specifier
        const jsDocTags = ts.getJSDocTags(element)
        const deprecatedTag = jsDocTags.find(tag => tag.tagName.text === 'deprecated')

        exports.push([exportName, !!deprecatedTag, deprecatedTag ? deprecatedTag.comment !== undefined : false])
      }
    }
  })
}

describe.each(entrypoints)('%s', (_name, _filepath, exports) => {
  describe.each(exports)('%s export', (_exportName, deprecatedTag, deprecatedComment) => {
    test('deprecated', () => {
      expect(deprecatedTag).toBe(true)
    })

    test('has deprecation comment', () => {
      expect(deprecatedComment).toBe(true)
    })
  })
})
