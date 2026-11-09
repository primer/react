import {describe, expect, it} from 'vitest'
import {responsiveClasses, responsiveUtilityClasses} from './responsive'

describe('responsiveClasses', () => {
  it('uses the provided default for omitted viewport values without inheriting neighboring ranges', () => {
    expect(
      responsiveClasses({regular: 'horizontal'}, {horizontal: 'flex-row', vertical: 'flex-col'}, 'vertical'),
    ).toEqual(['primer:flex-col', 'primer:md:flex-row', 'primer:2xl:flex-col'])
  })

  it('supports boolean values and static classes', () => {
    expect(responsiveClasses(false, {true: 'block', false: 'hidden'}, true)).toBe('primer:hidden')
  })

  it('uses fully static class maps for every responsive range', () => {
    expect(responsiveUtilityClasses['p-6']).toEqual({
      narrow: 'primer:p-6',
      regular: 'primer:md:p-6',
      wide: 'primer:2xl:p-6',
    })
    expect(responsiveUtilityClasses['mr-0']).toEqual({
      narrow: 'primer:mr-0',
      regular: 'primer:md:mr-0',
      wide: 'primer:2xl:mr-0',
    })
    expect(responsiveUtilityClasses['text-title-large']).toEqual({
      narrow: 'primer:text-title-large',
      regular: 'primer:md:text-title-large',
      wide: 'primer:2xl:text-title-large',
    })
  })

  it('fails when a responsive utility is missing from the static class map', () => {
    expect(() => responsiveClasses({regular: true}, {true: 'unknown-utility', false: 'hidden'}, false)).toThrow(
      'Missing static responsive Tailwind class map for "unknown-utility"',
    )
  })
})
