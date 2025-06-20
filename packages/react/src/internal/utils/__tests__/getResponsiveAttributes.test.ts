import {describe, expect, test} from 'vitest'
import {getResponsiveAttributes} from '../getResponsiveAttributes'

describe('getResponsiveAttributes', () => {
  test('property with undefined or null value', () => {
    expect(getResponsiveAttributes('grow', undefined)).not.toBeDefined()
    expect(getResponsiveAttributes('grow', null)).not.toBeDefined()
  })

  test('property with string value', () => {
    expect(getResponsiveAttributes('gap', 'none')).toMatchObject({
      'data-gap': 'none',
    })
  })

  test('property with boolean value', () => {
    expect(getResponsiveAttributes('grow', true)).toMatchObject({
      'data-grow': true,
    })

    expect(getResponsiveAttributes('grow', false)).toMatchObject({})
  })

  test('property with responsive values', () => {
    expect(getResponsiveAttributes('gap', {narrow: 'none', regular: 'condensed', wide: 'spacious'})).toMatchObject({
      'data-gap-narrow': 'none',
      'data-gap-regular': 'condensed',
      'data-gap-wide': 'spacious',
    })
  })
})
