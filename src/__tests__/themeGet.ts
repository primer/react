import {themeGet} from '..'

describe('themeGet', () => {
  it('acccepts theme prop', () => {
    const customTheme = {example: 'test'} as const
    expect(themeGet<typeof customTheme>('example')(customTheme)).toBe('test')
  })

  it('allows customTheme prop to override primer theme', () => {
    const customTheme = {colors: {gray: ['#f00']}} as const
    expect(themeGet<typeof customTheme>('colors.gray.0')(customTheme)).toBe('#f00')
  })

  it('uses primer theme as fallback', () => {
    const emptyTheme = {}
    expect(themeGet<typeof emptyTheme>('colors.gray.1')(emptyTheme)).toBe('#f6f8fa')

    const incompleteTheme = {colors: {foo: 'bar'}}
    expect(themeGet<typeof incompleteTheme>('colors.gray.1')(incompleteTheme)).toBe('#f6f8fa')
  })
})
