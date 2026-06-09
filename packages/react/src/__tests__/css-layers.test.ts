import fs from 'node:fs'
import path from 'node:path'
import {generate, parse} from 'css-tree'
import type {Atrule, StyleSheet} from 'css-tree'
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
      const first = ast.children.first

      expect(first?.type).toBe('Atrule')
      if (!first || first.type !== 'Atrule') throw new Error('Expected stylesheet to start with an @layer at-rule')

      expect(first.name).toBe('layer')
    })

    test('CSS Layer matches naming conventions', () => {
      const first = ast.children.first

      expect(first?.type).toBe('Atrule')
      if (!first || first.type !== 'Atrule') throw new Error('Expected stylesheet to start with an @layer at-rule')

      const layerName = first.prelude ? generate(first.prelude).trim() : ''
      expect(layerName).toMatch(CSS_LAYER_REGEX)
    })
  })
})
