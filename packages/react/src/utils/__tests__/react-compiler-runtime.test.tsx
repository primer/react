import {describe, expect, it} from 'vitest'
import {renderHook} from '@testing-library/react'
import {c} from '../react-compiler-runtime'

const MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel')

describe('react-compiler-runtime shim', () => {
  it('allocates a memo cache of the requested size seeded with the sentinel', () => {
    const {result} = renderHook(() => c(6))
    const cache = result.current

    expect(cache).toHaveLength(6)
    for (let index = 0; index < 6; index++) {
      expect(cache[index]).toBe(MEMO_CACHE_SENTINEL)
    }
    // The cache is marked as freshly allocated, matching `react-compiler-runtime`.
    expect((cache as unknown as Record<symbol, unknown>)[MEMO_CACHE_SENTINEL]).toBe(true)
  })

  it('returns a stable cache across re-renders', () => {
    const {result, rerender} = renderHook(() => c(4))
    const first = result.current

    rerender()

    expect(result.current).toBe(first)
  })
})
