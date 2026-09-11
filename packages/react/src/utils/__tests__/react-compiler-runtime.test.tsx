import {describe, expect, it} from 'vitest'
import {renderHook} from '@testing-library/react'
import {c, useMemoCache} from '../react-compiler-runtime'

const MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel')

describe('react-compiler-runtime shim', () => {
  it('exports a callable `c` (the compiler memo helper)', () => {
    expect(typeof c).toBe('function')
  })

  describe('useMemoCache fallback', () => {
    it('allocates a cache of the requested size seeded with the sentinel', () => {
      const {result} = renderHook(() => useMemoCache(6))
      const cache = result.current

      expect(cache).toHaveLength(6)
      for (let index = 0; index < 6; index++) {
        expect(cache[index]).toBe(MEMO_CACHE_SENTINEL)
      }
      expect((cache as unknown as Record<symbol, unknown>)[MEMO_CACHE_SENTINEL]).toBe(true)
    })

    it('reuses the same cache across re-renders', () => {
      const {result, rerender} = renderHook(() => useMemoCache(4))
      const first = result.current

      rerender()

      expect(result.current).toBe(first)
    })
  })
})
