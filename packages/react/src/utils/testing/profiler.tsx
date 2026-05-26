import React, {Profiler, type ProfilerOnRenderCallback, type ReactElement} from 'react'

export type RenderCounter = {
  /** Total number of times the wrapped subtree has rendered (mount + updates). */
  readonly count: number
  /** Number of mount renders. */
  readonly mountCount: number
  /** Number of update renders (any cause). */
  readonly updateCount: number
  /**
   * Number of updates triggered inside the same commit cycle that produced the
   * original render — i.e., a `setState` call from inside a `useLayoutEffect`
   * that forced a synchronous re-render before paint. This is the canonical
   * "nested update" / cascade signal; assert `nestedUpdateCount === 0` to pin
   * that a component never forces a double-commit.
   */
  readonly nestedUpdateCount: number
  /** Reset the counter. */
  reset(): void
}

/**
 * Returns a `[Wrap, counter]` pair. Wrap the component under test with `Wrap`
 * to count how many times its subtree renders. Useful for asserting that a
 * single user interaction (or a stable prop) does not cause cascading renders.
 *
 * @example
 *   const [Wrap, counter] = createRenderCounter()
 *   render(<Wrap><MyComponent /></Wrap>)
 *   // ... interaction ...
 *   expect(counter.updateCount).toBe(1)
 *   expect(counter.nestedUpdateCount).toBe(0)
 */
export function createRenderCounter(
  id = 'profiler-root',
): [(props: {children: ReactElement | ReactElement[]}) => ReactElement, RenderCounter] {
  const state = {count: 0, mountCount: 0, updateCount: 0, nestedUpdateCount: 0}

  const onRender: ProfilerOnRenderCallback = (_id, phase) => {
    state.count += 1
    if (phase === 'mount') state.mountCount += 1
    else state.updateCount += 1
    if (phase === 'nested-update') state.nestedUpdateCount += 1
  }

  const counter: RenderCounter = {
    get count() {
      return state.count
    },
    get mountCount() {
      return state.mountCount
    },
    get updateCount() {
      return state.updateCount
    },
    get nestedUpdateCount() {
      return state.nestedUpdateCount
    },
    reset() {
      state.count = 0
      state.mountCount = 0
      state.updateCount = 0
      state.nestedUpdateCount = 0
    },
  }

  const Wrap = ({children}: {children: ReactElement | ReactElement[]}) => (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )

  return [Wrap, counter]
}
