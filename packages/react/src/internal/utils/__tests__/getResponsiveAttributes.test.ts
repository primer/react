import {getResponsiveAttributes} from '../getResponsiveAttributes'

describe('getResponsiveAttributes', () => {
  test('no value provided', () => {
    expect(getResponsiveAttributes('test', undefined)).toBeUndefined()
    expect(getResponsiveAttributes('test', null)).toBeUndefined()
  })

  test('string value', () => {
    expect(getResponsiveAttributes('test', 'value')).toEqual({
      'data-test': 'value',
    })
  })

  test('boolean value', () => {
    expect(getResponsiveAttributes('test', true)).toEqual({
      'data-test': '',
    })
    expect(getResponsiveAttributes('test', false)).toBeUndefined()
  })

  test('responsive values', () => {
    expect(
      getResponsiveAttributes('test', {
        narrow: 'narrow',
        regular: 'regular',
        wide: 'wide',
      }),
    ).toEqual({
      'data-test-narrow': 'narrow',
      'data-test-regular': 'regular',
      'data-test-wide': 'wide',
    })
  })

  test('missing responsive values', () => {
    expect(
      getResponsiveAttributes('test', {
        narrow: 'narrow',
        wide: 'wide',
      }),
    ).toEqual({
      'data-test-narrow': 'narrow',
      'data-test-wide': 'wide',
    })
  })

  test('boolean responsive values', () => {
    expect(
      getResponsiveAttributes('test', {
        narrow: true,
        regular: false,
        wide: true,
      }),
    ).toEqual({
      'data-test-narrow': '',
      'data-test-wide': '',
    })
  })
})
