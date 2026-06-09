import fs from 'node:fs'
import path from 'node:path'
import {parse} from 'css-tree'
import type {Atrule, Raw, StyleSheet} from 'css-tree'
import {describe, expect, test} from 'vitest'

const allowlist = new Set([path.resolve(import.meta.dirname, '../Avatar/Avatar.module.css')])
const files = Array.from(allowlist).map(file => {
  return [path.basename(file), file]
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
