import {describe, it, expect} from 'vitest'
import {isResponsiveValue, type ResponsiveValue, type FlattenResponsiveValue} from '../responsiveTypes'

describe('responsiveTypes', () => {
  describe('isResponsiveValue', () => {
    it('returns true for objects with narrow key', () => {
      expect(isResponsiveValue({narrow: 'start'})).toBe(true)
    })

    it('returns true for objects with regular key', () => {
      expect(isResponsiveValue({regular: 'end'})).toBe(true)
    })

    it('returns true for objects with wide key', () => {
      expect(isResponsiveValue({wide: 'start'})).toBe(true)
    })

    it('returns true for objects with multiple viewport keys', () => {
      expect(isResponsiveValue({narrow: 'start', regular: 'end', wide: 'start'})).toBe(true)
    })

    it('returns false for plain strings', () => {
      expect(isResponsiveValue('start')).toBe(false)
    })

    it('returns false for numbers', () => {
      expect(isResponsiveValue(42)).toBe(false)
    })

    it('returns false for null', () => {
      expect(isResponsiveValue(null)).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isResponsiveValue(undefined)).toBe(false)
    })

    it('returns false for objects without viewport keys', () => {
      expect(isResponsiveValue({other: 'value'})).toBe(false)
    })

    it('is SSR-safe (does not use matchMedia or browser APIs)', () => {
      // This test verifies that isResponsiveValue can run in a non-browser environment
      // If it used matchMedia or other browser APIs, this would throw
      const result = isResponsiveValue({narrow: 'test'})
      expect(result).toBe(true)
    })
  })

  describe('ResponsiveValue type', () => {
    it('allows narrow property', () => {
      const value: ResponsiveValue<string> = {narrow: 'start'}
      expect(value.narrow).toBe('start')
    })

    it('allows regular property', () => {
      const value: ResponsiveValue<string> = {regular: 'end'}
      expect(value.regular).toBe('end')
    })

    it('allows wide property', () => {
      const value: ResponsiveValue<string> = {wide: 'start'}
      expect(value.wide).toBe('start')
    })

    it('allows all properties together', () => {
      const value: ResponsiveValue<string> = {
        narrow: 'start',
        regular: 'end',
        wide: 'start',
      }
      expect(value.narrow).toBe('start')
      expect(value.regular).toBe('end')
      expect(value.wide).toBe('start')
    })

    it('allows different types per viewport', () => {
      const value: ResponsiveValue<'line', 'filled', 'none'> = {
        narrow: 'filled',
        regular: 'line',
        wide: 'none',
      }
      expect(value.narrow).toBe('filled')
      expect(value.regular).toBe('line')
      expect(value.wide).toBe('none')
    })
  })

  describe('FlattenResponsiveValue type', () => {
    it('extracts all possible values from a responsive union type', () => {
      // This is a compile-time test - if it compiles, the type is working correctly
      type DividerProp = 'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>
      type AllValues = FlattenResponsiveValue<DividerProp>

      // These should all be valid assignments
      const value1: AllValues = 'none'
      const value2: AllValues = 'line'
      const value3: AllValues = 'filled'

      expect(value1).toBe('none')
      expect(value2).toBe('line')
      expect(value3).toBe('filled')
    })
  })
})
