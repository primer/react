import React, {useMemo} from 'react'

/**
 * Local, bundled replacement for the `c` helper exported by
 * `react-compiler-runtime`.
 *
 * The React Compiler emits `import {c} from 'react-compiler-runtime'`. The build
 * aliases that import to this module so the helper is bundled into
 * `@primer/react` as plain ES modules instead of being resolved as an external
 * CommonJS dependency. Leaving it external ships a bare cross-chunk import that
 * can crash (`TypeError: (0, t.c) is not a function`) when a consumer's bundle
 * graph resolves a skewed or duplicate copy across independently-cached chunks.
 *
 * The behavior mirrors `react-compiler-runtime`: prefer React's built-in
 * compiler runtime when it is available (React 19+), otherwise fall back to a
 * `useMemo`-backed cache. This module is excluded from the React Compiler (see
 * `script/react-compiler.mjs`) so it does not attempt to compile the helper that
 * backs the compiler's own runtime.
 */

const MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel')

type MemoCache = Array<unknown>

type ReactCompilerRuntime = {
  c?: (size: number) => MemoCache
}

// Exported for testing: the `useMemo`-backed fallback used when React does not
// provide a built-in compiler runtime.
export function useMemoCache(size: number): MemoCache {
  return useMemo(() => {
    const cache = new Array(size) as MemoCache & Record<symbol, unknown>
    for (let index = 0; index < size; index++) {
      cache[index] = MEMO_CACHE_SENTINEL
    }
    // Mark the cache as freshly allocated, matching `react-compiler-runtime`.
    cache[MEMO_CACHE_SENTINEL] = true
    return cache
    // `size` is a stable per-call-site constant; the cache must be allocated
    // exactly once, matching `react-compiler-runtime`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const builtinRuntime = (React as typeof React & {__COMPILER_RUNTIME?: ReactCompilerRuntime}).__COMPILER_RUNTIME

export const c: (size: number) => MemoCache = typeof builtinRuntime?.c === 'function' ? builtinRuntime.c : useMemoCache
