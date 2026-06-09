import fs from 'node:fs'
import path from 'node:path'
import {sync as glob} from 'fast-glob'
import {generate, parse} from 'css-tree'
import type {StyleSheet} from 'css-tree'
import {describe, expect, test} from 'vitest'

const CSS_LAYER_REGEX = /^primer\.components\.[A-Z][A-Za-z0-9]+$/
const SRC_DIR = path.resolve(import.meta.dirname, '..')

const CSS_MODULE_IGNORE_PATTERNS = [
  '**/*.dev.module.css',
  '**/*.examples.stories.module.css',
  '**/*.features.module.css',
  '**/*.figma.module.css',
  '**/*.stories.module.css',
  '**/*.test.module.css',
  '**/*StoryWrapper.module.css',
  'utils/StressTest.module.css',
]

const files = glob('**/*.module.css', {
  absolute: true,
  cwd: SRC_DIR,
  ignore: CSS_MODULE_IGNORE_PATTERNS,
}).map(file => {
  return [path.relative(SRC_DIR, file), file]
})

describe('CSS Layers', () => {
  test('discovers migrated CSS Modules', () => {
    expect(files.length).toBeGreaterThan(0)
  })

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
