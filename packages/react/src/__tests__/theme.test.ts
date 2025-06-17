import {describe, expect, it} from 'vitest'
import {isShadowValue} from '../utils/theme'

describe('isShadowValue', () => {
  it('accepts transparent', () => {
    expect(isShadowValue('0 0 0 transparent')).toBe(true)
  })

  it('accepts hex colors', () => {
    expect(isShadowValue('0 0 0 #ff0000')).toBe(true)
    expect(isShadowValue('0 0 0 #ff0')).toBe(true)
  })

  it('accepts rgba colors', () => {
    expect(isShadowValue('0 0 0 rgb(255, 0, 0)')).toBe(true)
    expect(isShadowValue('0 0 0 rgba(255,0,0,0.2)')).toBe(true)
  })

  it('accepts px values', () => {
    expect(isShadowValue('12px 24px 0 #000')).toBe(true)
  })

  it('accepts em values', () => {
    expect(isShadowValue('0.5em 1em 0 #000')).toBe(true)
  })

  it('accepts inset values', () => {
    expect(isShadowValue('inset 12px 24px 0 #000')).toBe(true)
  })

  it('rejects individual colors', () => {
    expect(isShadowValue('red')).toBe(false)
    expect(isShadowValue('#f00')).toBe(false)
    expect(isShadowValue('rgb(255, 0, 0)')).toBe(false)
  })

  it('rejects individual numeric values', () => {
    expect(isShadowValue('0')).toBe(false)
    expect(isShadowValue('12px')).toBe(false)
    expect(isShadowValue('0.5em')).toBe(false)
  })
})
