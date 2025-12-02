import {describe, test, expect} from 'vitest'
import ts from 'typescript'
import path from 'node:path'

const entrypoint = path.resolve(import.meta.dirname, '../index.tsx')
const program = ts.createProgram([entrypoint], {
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.ESNext,
})
const sourceFile = program.getSourceFile(entrypoint)
const exports: Array<[name: string, deprecatedTag: boolean, deprecatedComment: boolean]> = []

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

describe('@primer/styled-react', () => {
  describe.each(exports)('%s export', (_, deprecatedTag, deprecatedComment) => {
    test('deprecated', () => {
      expect(deprecatedTag).toBe(true)
    })

    test('has deprecation comment', () => {
      expect(deprecatedComment).toBe(true)
    })
  })
})
