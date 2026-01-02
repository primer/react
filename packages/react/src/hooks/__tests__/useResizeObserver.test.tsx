import {render, waitFor, act} from '@testing-library/react'
import {useRef, useEffect, useState, useImperativeHandle, forwardRef} from 'react'
import {describe, expect, test} from 'vitest'
import {useResizeObserver, type ResizeObserverEntry} from '../useResizeObserver'

interface TestHandle {
  setWidth: (width: number) => void
}

const ResizableComponent = forwardRef<TestHandle, {callback: (entries: ResizeObserverEntry[]) => void}>(
  function ResizableComponent({callback}, ref) {
    const elementRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(100)
    useResizeObserver(callback, elementRef)

    useImperativeHandle(ref, () => ({
      setWidth,
    }))

    return <div ref={elementRef} style={{width, height: 100}} data-testid="target" />
  },
)

describe('useResizeObserver', () => {
  test('fires callback on first observation', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(entries => {
        callbackEntries.push(entries)
      }, ref)
      return <div ref={ref} style={{width: 100, height: 100}} data-testid="target" />
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(0)
    })
  })

  test('fires callback when element resizes', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []
    const handleRef = {current: null as TestHandle | null}

    function TestComponent() {
      const ref = useRef<TestHandle>(null)

      useEffect(() => {
        handleRef.current = ref.current
      })

      return (
        <ResizableComponent
          ref={ref}
          callback={entries => {
            callbackEntries.push(entries)
          }}
        />
      )
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(callbackEntries.length).toBe(1)
    })

    await act(async () => {
      handleRef.current?.setWidth(200)
    })

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(1)
    })

    const lastEntry = callbackEntries[callbackEntries.length - 1][0]
    expect(lastEntry.contentRect.width).toBe(200)
  })

  test('uses document.documentElement as default target', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []

    function TestComponent() {
      useResizeObserver(entries => {
        callbackEntries.push(entries)
      })
      return null
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(0)
    })
  })

  test('observes provided ref as target', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(entries => {
        callbackEntries.push(entries)
      }, ref)
      return <div ref={ref} style={{width: 150, height: 75}} data-testid="target" />
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(0)
    })

    const entry = callbackEntries[0][0]
    expect(entry.contentRect.width).toBe(150)
    expect(entry.contentRect.height).toBe(75)
  })

  test('uses latest callback when it changes', async () => {
    const callback1Entries: ResizeObserverEntry[][] = []
    const callback2Entries: ResizeObserverEntry[][] = []

    function TestComponent({callback, width}: {callback: (entries: ResizeObserverEntry[]) => void; width: number}) {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(callback, ref)
      return <div ref={ref} style={{width, height: 100}} data-testid="target" />
    }

    const {rerender} = render(<TestComponent callback={entries => callback1Entries.push(entries)} width={100} />)

    await waitFor(() => {
      expect(callback1Entries.length).toBeGreaterThan(0)
    })

    // Update callback and trigger resize
    rerender(<TestComponent callback={entries => callback2Entries.push(entries)} width={200} />)

    await waitFor(() => {
      expect(callback2Entries.length).toBeGreaterThan(0)
    })
  })

  test('re-observes when depsArray changes', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []

    function TestComponent({dep}: {dep: number}) {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(
        entries => {
          callbackEntries.push(entries)
        },
        ref,
        [dep],
      )
      return <div ref={ref} style={{width: 100, height: 100}} data-testid="target" />
    }

    const {rerender} = render(<TestComponent dep={1} />)

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(0)
    })

    const initialCallCount = callbackEntries.length

    rerender(<TestComponent dep={2} />)

    await waitFor(() => {
      expect(callbackEntries.length).toBeGreaterThan(initialCallCount)
    })
  })

  test('does not fire callback when ref is null', async () => {
    const callbackEntries: ResizeObserverEntry[][] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(entries => {
        callbackEntries.push(entries)
      }, ref)
      // Don't attach ref to any element
      return null
    }

    render(<TestComponent />)

    // Wait a bit to ensure no callbacks fire
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(callbackEntries.length).toBe(0)
  })
})
