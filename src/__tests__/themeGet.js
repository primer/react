import {themeGet} from '..'

describe('themeGet', () => {
  it('acccepts theme prop', () => {
    expect(themeGet('example')({theme: {example: 'test'}})).toBe('test')
  })

  it('allows theme prop to override primer theme', () => {
    expect(themeGet('colors.gray.0')({theme: {colors: {gray: ['#f00']}}})).toBe('#f00')
  })

  it('uses primer theme as fallback', () => {
    expect(themeGet('colors.gray.1')({})).toBe('#f6f8fa')
    expect(themeGet('colors.gray.1')({theme: {colors: {foo: 'bar'}}})).toBe('#f6f8fa')
  })
})
