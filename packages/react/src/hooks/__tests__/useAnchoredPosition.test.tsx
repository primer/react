import {render, waitFor, act} from '@testing-library/react'
import {it, expect, vi, describe} from 'vitest'
import React from 'react'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'

const Component = ({callback}: {callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void}) => {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef}))
  return (
    <div style={{position: 'absolute'}}>
      <div
        style={{position: 'absolute', top: '20px', left: '20px', height: '50px', width: '50px'}}
        ref={floatingElementRef}
      />
      <div ref={anchorElementRef} />
    </div>
  )
}

it('should should return a position', async () => {
  const cb = vi.fn()
  render(<Component callback={cb} />)

  await waitFor(() => {
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb.mock.calls[1][0]['position']).toMatchInlineSnapshot(`
    {
      "anchorAlign": "start",
      "anchorSide": "outside-bottom",
      "left": 0,
      "top": 4,
    }
  `)
  })
})

it('should not trigger cascading setState in useLayoutEffect when overlay is closed on mount', async () => {
  // When no floating element is present (overlay closed), the initial
  // updatePosition call is deferred to useEffect so it does not produce
  // synchronous cascading re-renders that block paint.
  const ClosedOverlayComponent = ({
    callback,
  }: {
    callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  }) => {
    // Refs that are never attached to DOM elements – simulates a closed overlay
    const floatingElementRef = React.useRef<HTMLDivElement>(null)
    const anchorElementRef = React.useRef<HTMLDivElement>(null)
    callback(useAnchoredPosition({floatingElementRef, anchorElementRef}))
    return <div />
  }

  const cb = vi.fn()
  render(<ClosedOverlayComponent callback={cb} />)

  // With the deferred pattern the component should render exactly once
  // synchronously (no cascading setState from useLayoutEffect).
  // The useEffect fires after paint and is a no-op (position is already
  // undefined), so the callback count should stay at 1.
  await waitFor(() => {
    expect(cb).toHaveBeenCalledTimes(1)
  })

  // Position should remain undefined since overlay is closed
  expect(cb.mock.calls[0][0]['position']).toBeUndefined()
})

describe('scroll recalculation', () => {
  it('should recalculate position when window scrolls', async () => {
    const cb = vi.fn()
    render(<Component callback={cb} />)

    // Wait for initial position calculation to stabilise
    await waitFor(() => {
      expect(cb).toHaveBeenCalledTimes(2)
    })

    const callCountBefore = cb.mock.calls.length

    // Simulate a window scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    // Wait for rAF-throttled handler to fire and trigger re-render
    await waitFor(() => {
      expect(cb.mock.calls.length).toBeGreaterThan(callCountBefore)
    })
  })

  it('should recalculate position when a scrollable ancestor scrolls', async () => {
    const ScrollableComponent = ({
      callback,
    }: {
      callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
    }) => {
      const floatingElementRef = React.useRef<HTMLDivElement>(null)
      const anchorElementRef = React.useRef<HTMLDivElement>(null)
      callback(useAnchoredPosition({floatingElementRef, anchorElementRef}))
      return (
        <div style={{overflow: 'auto', height: '200px'}}>
          <div style={{height: '1000px'}}>
            <div
              style={{position: 'absolute', top: '20px', left: '20px', height: '50px', width: '50px'}}
              ref={floatingElementRef}
            />
            <div ref={anchorElementRef} />
          </div>
        </div>
      )
    }

    const cb = vi.fn()
    const {container} = render(<ScrollableComponent callback={cb} />)

    await waitFor(() => {
      expect(cb).toHaveBeenCalledTimes(2)
    })

    const callCountBefore = cb.mock.calls.length
    const scrollContainer = container.firstElementChild!

    // Simulate scroll on the scrollable ancestor
    act(() => {
      scrollContainer.dispatchEvent(new Event('scroll'))
    })

    // Wait for rAF-throttled handler to fire and trigger re-render
    await waitFor(() => {
      expect(cb.mock.calls.length).toBeGreaterThan(callCountBefore)
    })
  })
})
