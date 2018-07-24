import {bg, borderColor, color, fontSize} from '../mappers'

describe('props mapping utilities', () => {
  describe('bg', () => {
    it('returns the right className', () => {
      expect(bg({bg: 'gray'})).toEqual({className: 'bg-gray'})
      expect(bg({bg: 'red'})).toEqual({className: 'bg-red'})
      expect(bg({bg: 'red-light'})).toEqual({className: 'bg-red-light'})
    })
  })

  describe('color', () => {
    it('returns the right className', () => {
      expect(color({color: 'gray.0'})).toEqual({className: 'color-gray-0'})
      expect(color({color: 'red.5'})).toEqual({className: 'color-red-5'})
    })
  })

  describe('borderColor', () => {
    it('returns the right className', () => {
      expect(borderColor({borderColor: 'gray'})).toEqual({className: 'border-gray'})
    })
  })

  describe('fontSize', () => {
    it('returns the right className', () => {
      expect(fontSize({fontSize: 0})).toEqual({className: 'f-0'})
    })
    it('handles responsive values', () => {
      expect(fontSize({fontSize: [1, null, 2]})).toEqual({className: 'f-1 f-md-2'})
    })
  })
})
