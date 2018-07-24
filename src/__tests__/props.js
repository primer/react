import {createResponsiveMapper, breakpoints, stylizer} from '../props'
import {spacing} from '../mappers'

describe('props helpers', () => {
  describe('breakpoints array', () => {
    it('is an array', () => {
      expect(Array.isArray(breakpoints)).toEqual(true)
    })
  })

  describe('spacing()', () => {
    it('does the thing', () => {
      expect(spacing({m: 0})).toEqual({className: 'm-0'})
      expect(spacing({p: 1})).toEqual({className: 'p-1'})
      expect(spacing({pr: 2})).toEqual({className: 'pr-2'})
      expect(spacing({m: [4, null, 1]})).toEqual({className: 'm-4 m-md-1'})
      expect(spacing({p: [0, null, null, 3]})).toEqual({className: 'p-0 p-lg-3'})
    })
  })

  describe('createResponsiveMapper()', () => {
    const mapper = createResponsiveMapper(['a', 'b'])
    it('creates a mapper from a list of props', () => {
      expect(typeof mapper).toEqual('function')
    })

    it('adds propTypes for each prop', () => {
      const {propTypes} = mapper
      expect(propTypes && typeof propTypes).toEqual('object')
      expect(Object.keys(propTypes)).toEqual(['a', 'b'])
    })

    it('maps props', () => {
      expect(mapper({a: 1})).toEqual({className: 'a-1'})
      expect(mapper({b: 2})).toEqual({className: 'b-2'})
      expect(mapper({a: 0, b: 3})).toEqual({className: 'a-0 b-3'})
      expect(mapper({b: null})).toEqual({className: ''})
    })

    it('does responsive mappings', () => {
      expect(mapper({a: [2, null, 0]})).toEqual({className: 'a-2 a-md-0'})
    })
  })
})

describe('stylizer()', () => {
  const stylize = stylizer(['color'])

  it('returns a function', () => {
    expect(typeof stylize).toEqual('function')
  })

  it('maps stylized props to the "style" prop', () => {
    expect(stylize({color: 'red'})).toEqual({style: {color: 'red'}})
  })

  it('preserves existing styles', () => {
    expect(stylize({color: 'red', style: {background: 'black'}})).toEqual({style: {background: 'black', color: 'red'}})
  })
})
