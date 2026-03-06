import {describe, expect, it} from 'vitest'
import {themeGet} from '..'

describe('themeGet', () => {
  it('accepts theme prop', () => {
    expect(themeGet('example')({theme: {example: 'test'}})).toBe('test')
  })

  it('allows theme prop to override primer theme', () => {
    expect(themeGet('colors.gray.0')({theme: {colors: {gray: ['#f00']}}})).toBe('#f00')
  })

  it('uses primer theme as fallback', () => {
    expect(themeGet('space.1')({})).toBe('4px')
  })
})
