import fs from 'node:fs'
import path from 'node:path'
import {parse} from 'css-tree'
import type {Atrule, Raw, StyleSheet} from 'css-tree'
import {describe, expect, test} from 'vitest'
import glob from 'fast-glob'

const WORKSPACE_SRC_FOLDER = path.resolve(import.meta.dirname, '..')
const ignorelist = new Set(['experimental/CSSComponent/component.module.css'])

const files = glob
  .sync('**/*.module.css', {
    cwd: WORKSPACE_SRC_FOLDER,
    ignore: ['**/*.stories.module.css', '**/*.test.module.css', '**/*.dev.module.css'],
  })
  .filter(file => !ignorelist.has(file))
  .map(file => {
    return [path.basename(file), path.join(WORKSPACE_SRC_FOLDER, file)]
  })

const CSS_LAYER_REGEX = /^primer\.components\.[A-Z][A-Za-z0-9]+$/

describe('CSS Layers', () => {
  describe.each(files)('%s', (_name, filename) => {
    const contents = fs.readFileSync(filename, 'utf8')
    const ast = parse(contents, {
      filename,
    }) as StyleSheet

    test('uses CSS Layer', () => {
      expect(ast.children.first?.type).toBe('Atrule')
      const node = ast.children.first as Atrule

      expect(node.name).toBe('layer')
    })

    test('CSS Layer matches naming conventions', () => {
      const node = ast.children.first as Atrule

      expect(node.prelude?.type).toBe('Raw')
      const prelude = node.prelude as Raw

      expect(prelude.value).toMatch(CSS_LAYER_REGEX)
    })
  })
})
