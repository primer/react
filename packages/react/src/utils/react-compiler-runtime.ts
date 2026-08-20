import React, {useMemo} from 'react'

// Local replacement for the `c` helper from `react-compiler-runtime`. The build
// aliases the compiler's `import {c} from 'react-compiler-runtime'` to this file
// so only `c` is bundled (as clean ESM), instead of externalizing the whole
// CommonJS package. Mirrors the upstream behavior: prefer React's built-in
// compiler runtime (React 19+), otherwise fall back to a `useMemo`-backed cache.
const MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel')

type MemoCache = Array<unknown>

// Exported for testing: the `useMemo`-backed fallback used when React does not
// provide a built-in compiler runtime.
export function useMemoCache(size: number): MemoCache {
  return useMemo(() => {
    const cache = new Array(size) as MemoCache & Record<symbol, unknown>
    for (let index = 0; index < size; index++) {
      cache[index] = MEMO_CACHE_SENTINEL
    }
    cache[MEMO_CACHE_SENTINEL] = true
    return cache
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const builtinRuntime = (React as typeof React & {__COMPILER_RUNTIME?: {c?: (size: number) => MemoCache}})
  .__COMPILER_RUNTIME

export const c: (size: number) => MemoCache = typeof builtinRuntime?.c === 'function' ? builtinRuntime.c : useMemoCache
