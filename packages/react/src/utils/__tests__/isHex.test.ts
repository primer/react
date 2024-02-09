import {isHex} from '../isHex'

describe('utils: isHex', () => {
  it('should return true for valid hex3, hex4, hex6 and hex8 strings', () => {
    expect(isHex('#fff')).toBe(true)
    expect(isHex('#123a')).toBe(true)
    expect(isHex('#ffffff')).toBe(true)
    expect(isHex('#ffffffaa')).toBe(true)
  })
  it('should return false for invalid hex strings', () => {
    expect(isHex('#ff')).toBe(false)
    expect(isHex('#ff345')).toBe(false)
    expect(isHex('#ff345ff')).toBe(false)
  })
  it('should return true for valid strings', () => {
    expect(isHex('fff')).toBe(true)
    expect(isHex('ff34')).toBe(true)
    expect(isHex('ff345f')).toBe(true)
    expect(isHex('ff345faa')).toBe(true)
  })
  it('should return false for invalid strings', () => {
    expect(isHex('ff')).toBe(false)
    expect(isHex('ff345')).toBe(false)
    expect(isHex('ff345ff')).toBe(false)
  })
})
