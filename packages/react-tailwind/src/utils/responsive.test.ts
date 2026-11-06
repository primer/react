import {describe, expect, it} from 'vitest'
import {responsiveClasses, responsiveUtilityClasses} from './responsive'

describe('responsiveClasses', () => {
  it('uses the provided default for omitted viewport values without inheriting neighboring ranges', () => {
    expect(
      responsiveClasses({regular: 'horizontal'}, {horizontal: 'flex-row', vertical: 'flex-col'}, 'vertical'),
    ).toEqual(['flex-col', 'md:flex-row', '2xl:flex-col'])
  })

  it('supports boolean values and static classes', () => {
    expect(responsiveClasses(false, {true: 'block', false: 'hidden'}, true)).toBe('hidden')
  })

  it('uses fully static class maps for every responsive range', () => {
    expect(responsiveUtilityClasses['p-6']).toEqual({narrow: 'p-6', regular: 'md:p-6', wide: '2xl:p-6'})
    expect(responsiveUtilityClasses['mr-0']).toEqual({narrow: 'mr-0', regular: 'md:mr-0', wide: '2xl:mr-0'})
    expect(responsiveUtilityClasses['text-title-large']).toEqual({
      narrow: 'text-title-large',
      regular: 'md:text-title-large',
      wide: '2xl:text-title-large',
    })
  })

  it('fails when a responsive utility is missing from the static class map', () => {
    expect(() => responsiveClasses({regular: true}, {true: 'unknown-utility', false: 'hidden'}, false)).toThrow(
      'Missing static responsive Tailwind class map for "unknown-utility"',
    )
  })
})
