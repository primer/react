import {renderHook} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {useId} from '../useId'

describe('useId', () => {
  test('returns a generated id when no arguments are provided', () => {
    const {result} = renderHook(() => useId())
    expect(typeof result.current).toBe('string')
    expect(result.current.length).toBeGreaterThan(0)
  })

  test('returns the provided id when one is passed', () => {
    const {result} = renderHook(() => useId('my-id'))
    expect(result.current).toBe('my-id')
  })

  test('prefixes the generated id when a prefix is provided', () => {
    const {result} = renderHook(() => useId(undefined, 'character-count'))
    expect(result.current.startsWith('character-count-')).toBe(true)
    expect(result.current.length).toBeGreaterThan('character-count-'.length)
  })

  test('ignores the prefix when an explicit id is provided', () => {
    const {result} = renderHook(() => useId('my-id', 'character-count'))
    expect(result.current).toBe('my-id')
  })

  test('returns the same id across re-renders', () => {
    const {result, rerender} = renderHook(() => useId(undefined, 'foo'))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
