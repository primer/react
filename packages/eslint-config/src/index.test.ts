import {describe, expect, test} from 'vitest'
import {config, plugin} from './index.ts'

describe('@primer/eslint-config', () => {
  test('exports the prefer-merge-props rule disabled by default', () => {
    expect(plugin.rules?.['prefer-merge-props']).toBeDefined()
    expect(config.rules?.['primer/prefer-merge-props']).toBe('off')
  })
})
