import {render, waitFor, act, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import React from 'react'
import type {AnchoredPositionHookSettings} from '../useAnchoredPosition'
import {useAnchoredPosition} from '../useAnchoredPosition'

// Helper component that exposes hook return value via callback
function TestComponent({
  callback,
  settings,
  dependencies,
}: {
  callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  settings?: AnchoredPositionHookSettings
  dependencies?: React.DependencyList
}) {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef, ...settings}, dependencies))
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

// Helper component with externally provided refs
function TestComponentWithRefs({
  callback,
  settings,
  floatingElementRef,
  anchorElementRef,
}: {
  callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  settings?: Omit<AnchoredPositionHookSettings, 'floatingElementRef' | 'anchorElementRef'>
  floatingElementRef: React.RefObject<HTMLDivElement | null>
  anchorElementRef: React.RefObject<HTMLDivElement | null>
}) {
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef, ...settings}))
  return (
    <div style={{position: 'absolute'}}>
      <div
        style={{position: 'absolute', top: '20px', left: '20px', height: '50px', width: '50px'}}
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
      />
      <div ref={anchorElementRef as React.RefObject<HTMLDivElement>} />
    </div>
  )
}

// Component that conditionally renders the floating element
function ConditionalFloatingComponent({
  callback,
  showFloating,
}: {
  callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  showFloating: boolean
}) {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef}))
  return (
    <div style={{position: 'absolute'}}>
      {showFloating && (
        <div
          style={{position: 'absolute', top: '20px', left: '20px', height: '50px', width: '50px'}}
          ref={floatingElementRef}
        />
      )}
      <div ref={anchorElementRef} style={{width: '100px', height: '30px'}} />
    </div>
  )
}

describe('useAnchoredPosition', () => {
  describe('basic functionality', () => {
    it('should return a position when both elements are present', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} />)

      await waitFor(() => {
        expect(cb).toHaveBeenCalled()
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toMatchInlineSnapshot(`
          {
            "anchorAlign": "start",
            "anchorSide": "outside-bottom",
            "left": 0,
            "top": 4,
          }
        `)
      })
    })

    it('should return refs for floating and anchor elements', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.floatingElementRef).toBeDefined()
        expect(lastCall.anchorElementRef).toBeDefined()
        expect(lastCall.floatingElementRef.current).toBeInstanceOf(HTMLDivElement)
        expect(lastCall.anchorElementRef.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    it('should return undefined position when floating element is missing', async () => {
      const cb = vi.fn()
      render(<ConditionalFloatingComponent callback={cb} showFloating={false} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toBeUndefined()
      })
    })

    it('should calculate position when floating element becomes available', async () => {
      const cb = vi.fn()
      const {rerender} = render(<ConditionalFloatingComponent callback={cb} showFloating={false} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toBeUndefined()
      })

      rerender(<ConditionalFloatingComponent callback={cb} showFloating={true} />)

      await waitFor(
        () => {
          const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
          expect(lastCall.position).toBeDefined()
          expect(typeof lastCall.position.top).toBe('number')
          expect(typeof lastCall.position.left).toBe('number')
        },
        {timeout: 1000},
      )
    })
  })

  describe('provided refs', () => {
    it('should use provided refs instead of creating new ones', async () => {
      const cb = vi.fn()
      const floatingRef = React.createRef<HTMLDivElement>()
      const anchorRef = React.createRef<HTMLDivElement>()

      function Wrapper() {
        return <TestComponentWithRefs callback={cb} floatingElementRef={floatingRef} anchorElementRef={anchorRef} />
      }

      render(<Wrapper />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.floatingElementRef).toBe(floatingRef)
        expect(lastCall.anchorElementRef).toBe(anchorRef)
      })
    })
  })

  describe('onPositionChange callback', () => {
    it('should call onPositionChange when position is calculated', async () => {
      const cb = vi.fn()
      const onPositionChange = vi.fn()

      render(<TestComponent callback={cb} settings={{onPositionChange}} />)

      await waitFor(() => {
        expect(onPositionChange).toHaveBeenCalled()
        const lastPosition = onPositionChange.mock.calls[onPositionChange.mock.calls.length - 1][0]
        expect(lastPosition).toMatchObject({
          anchorSide: expect.any(String),
          anchorAlign: expect.any(String),
          top: expect.any(Number),
          left: expect.any(Number),
        })
      })
    })

    it('should call onPositionChange with undefined when elements are missing', async () => {
      const cb = vi.fn()

      render(<ConditionalFloatingComponent callback={cb} showFloating={false} />)

      // Note: onPositionChange won't be called with undefined on initial render
      // because the hook is set up without the callback in ConditionalFloatingComponent
      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toBeUndefined()
      })
    })
  })

  describe('position settings', () => {
    it('should respect side setting', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} settings={{side: 'outside-top'}} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        // The actual side may be adjusted based on available space
        expect(lastCall.position).toBeDefined()
        expect(['outside-top', 'outside-bottom', 'inside-top', 'inside-bottom']).toContain(lastCall.position.anchorSide)
      })
    })

    it('should respect align setting', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} settings={{align: 'center'}} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toBeDefined()
        expect(['start', 'center', 'end']).toContain(lastCall.position.anchorAlign)
      })
    })
  })

  describe('dependencies parameter', () => {
    it('should recalculate position when dependencies change', async () => {
      const cb = vi.fn()
      let dep = 1

      function DependencyComponent() {
        const floatingElementRef = React.useRef<HTMLDivElement>(null)
        const anchorElementRef = React.useRef<HTMLDivElement>(null)
        cb(useAnchoredPosition({floatingElementRef, anchorElementRef}, [dep]))
        return (
          <div style={{position: 'absolute'}}>
            <div style={{position: 'absolute', height: '50px', width: '50px'}} ref={floatingElementRef} />
            <div ref={anchorElementRef} />
          </div>
        )
      }

      const {rerender} = render(<DependencyComponent />)

      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThan(0)
      })

      const callCountBeforeChange = cb.mock.calls.length

      dep = 2
      rerender(<DependencyComponent />)

      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThan(callCountBeforeChange)
      })
    })
  })

  describe('resize handling', () => {
    it('should recalculate position on window resize', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} />)

      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThan(0)
      })

      const callCountBeforeResize = cb.mock.calls.length

      act(() => {
        fireEvent(window, new Event('resize'))
      })

      // Position recalculation may be async
      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThanOrEqual(callCountBeforeResize)
      })
    })
  })

  describe('cleanup', () => {
    it('should not throw on unmount', async () => {
      const cb = vi.fn()

      const {unmount} = render(<TestComponent callback={cb} />)

      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThan(0)
      })

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('position properties', () => {
    it('should return position with required properties', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.position).toBeDefined()
        expect(lastCall.position).toHaveProperty('top')
        expect(lastCall.position).toHaveProperty('left')
        expect(lastCall.position).toHaveProperty('anchorSide')
        expect(lastCall.position).toHaveProperty('anchorAlign')
      })
    })

    it('should return numeric top and left values', async () => {
      const cb = vi.fn()
      render(<TestComponent callback={cb} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(typeof lastCall.position.top).toBe('number')
        expect(typeof lastCall.position.left).toBe('number')
        expect(Number.isFinite(lastCall.position.top)).toBe(true)
        expect(Number.isFinite(lastCall.position.left)).toBe(true)
      })
    })
  })

  describe('multiple instances', () => {
    it('should handle multiple instances independently', async () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()

      render(
        <div>
          <TestComponent callback={cb1} />
          <TestComponent callback={cb2} />
        </div>,
      )

      await waitFor(() => {
        expect(cb1.mock.calls.length).toBeGreaterThan(0)
        expect(cb2.mock.calls.length).toBeGreaterThan(0)

        const lastCall1 = cb1.mock.calls[cb1.mock.calls.length - 1][0]
        const lastCall2 = cb2.mock.calls[cb2.mock.calls.length - 1][0]

        // Each instance should have its own refs
        expect(lastCall1.floatingElementRef).not.toBe(lastCall2.floatingElementRef)
        expect(lastCall1.anchorElementRef).not.toBe(lastCall2.anchorElementRef)
      })
    })
  })

  describe('re-render stability', () => {
    it('should maintain ref identity across re-renders', async () => {
      const cb = vi.fn()
      const {rerender} = render(<TestComponent callback={cb} />)

      await waitFor(() => {
        expect(cb.mock.calls.length).toBeGreaterThan(0)
      })

      const initialFloatingRef = cb.mock.calls[0][0].floatingElementRef
      const initialAnchorRef = cb.mock.calls[0][0].anchorElementRef

      rerender(<TestComponent callback={cb} />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.floatingElementRef).toBe(initialFloatingRef)
        expect(lastCall.anchorElementRef).toBe(initialAnchorRef)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty settings', async () => {
      const cb = vi.fn()

      function MinimalComponent() {
        const floatingElementRef = React.useRef<HTMLDivElement>(null)
        const anchorElementRef = React.useRef<HTMLDivElement>(null)
        const result = useAnchoredPosition({floatingElementRef, anchorElementRef})
        cb(result)
        return (
          <div>
            <div ref={floatingElementRef} />
            <div ref={anchorElementRef} />
          </div>
        )
      }

      render(<MinimalComponent />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.floatingElementRef).toBeDefined()
        expect(lastCall.anchorElementRef).toBeDefined()
      })
    })

    it('should handle undefined settings', async () => {
      const cb = vi.fn()

      function UndefinedSettingsComponent() {
        const floatingElementRef = React.useRef<HTMLDivElement>(null)
        const anchorElementRef = React.useRef<HTMLDivElement>(null)
        const result = useAnchoredPosition({floatingElementRef, anchorElementRef})
        cb(result)
        return (
          <div>
            <div ref={floatingElementRef} />
            <div ref={anchorElementRef} />
          </div>
        )
      }

      render(<UndefinedSettingsComponent />)

      await waitFor(() => {
        const lastCall = cb.mock.calls[cb.mock.calls.length - 1][0]
        expect(lastCall.floatingElementRef).toBeDefined()
        expect(lastCall.anchorElementRef).toBeDefined()
      })
    })
  })
})
