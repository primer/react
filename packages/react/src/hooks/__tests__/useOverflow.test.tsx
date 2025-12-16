import {render, act} from '@testing-library/react'
import {useRef, useEffect} from 'react'
import {describe, expect, test, vi, beforeEach, afterEach} from 'vitest'
import {useOverflow} from '../useOverflow'

// Mock ResizeObserver
let mockResizeObserverCallback: ResizeObserverCallback | null = null
let mockObservedElements: Element[] = []

class MockResizeObserver {
  callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    mockResizeObserverCallback = callback
  }

  observe(target: Element) {
    mockObservedElements.push(target)
    // ResizeObserver fires immediately on observe() with initial dimensions
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this,
    )
  }

  unobserve(target: Element) {
    mockObservedElements = mockObservedElements.filter(el => el !== target)
  }

  disconnect() {
    mockObservedElements = []
  }
}

// Helper to trigger resize events on an element
function triggerResizeOnElement(target: Element, hasOverflow: boolean) {
  if (mockResizeObserverCallback) {
    // Mock the target's scroll dimensions
    Object.defineProperty(target, 'scrollHeight', {
      value: hasOverflow ? 200 : 100,
      configurable: true,
    })
    Object.defineProperty(target, 'clientHeight', {
      value: 100,
      configurable: true,
    })
    Object.defineProperty(target, 'scrollWidth', {
      value: hasOverflow ? 200 : 100,
      configurable: true,
    })
    Object.defineProperty(target, 'clientWidth', {
      value: 100,
      configurable: true,
    })

    mockResizeObserverCallback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      {} as ResizeObserver,
    )
  }
}

describe('useOverflow', () => {
  let originalResizeObserver: typeof ResizeObserver
  let rafCallbacks: Array<FrameRequestCallback>
  let rafIdCounter: number

  beforeEach(() => {
    // Store original and replace with mock
    originalResizeObserver = globalThis.ResizeObserver
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

    // Mock requestAnimationFrame
    rafCallbacks = []
    rafIdCounter = 0
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback)
      return ++rafIdCounter
    })
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((_id: number) => {
      // Track the call
    })

    mockResizeObserverCallback = null
    mockObservedElements = []
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver
    vi.restoreAllMocks()
  })

  // Helper to flush all pending animation frames
  function flushAnimationFrames() {
    const callbacks = [...rafCallbacks]
    rafCallbacks = []
    for (const cb of callbacks) {
      cb(performance.now())
    }
  }

  // Test component that reports results via callback
  function TestComponent({
    onResult,
    onRef,
  }: {
    onResult?: (result: boolean) => void
    onRef?: (element: HTMLDivElement | null) => void
  }) {
    const ref = useRef<HTMLDivElement>(null)
    const result = useOverflow(ref)

    useEffect(() => {
      onResult?.(result)
    }, [result, onResult])

    useEffect(() => {
      onRef?.(ref.current)
    }, [onRef])

    return <div ref={ref} data-testid="target" style={{width: 100, height: 100}} />
  }

  test('returns false when element has no overflow', () => {
    const results: boolean[] = []

    render(<TestComponent onResult={result => results.push(result)} />)

    expect(results).toContain(false)
  })

  test('checks overflow immediately on first observation', () => {
    const results: boolean[] = []

    render(<TestComponent onResult={result => results.push(result)} />)

    // Initial check happens immediately on observe
    expect(results.length).toBeGreaterThan(0)
  })

  test('throttles subsequent overflow checks using requestAnimationFrame', () => {
    let targetElement: HTMLDivElement | null = null

    render(<TestComponent onRef={el => (targetElement = el)} />)

    // First observation is immediate, no rAF yet
    expect(requestAnimationFrame).toHaveBeenCalledTimes(0)

    // Trigger multiple rapid resize events
    act(() => {
      if (targetElement) {
        triggerResizeOnElement(targetElement, false)
        triggerResizeOnElement(targetElement, true)
        triggerResizeOnElement(targetElement, false)
      }
    })

    // requestAnimationFrame should have been called only once for throttling
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  test('processes latest entries after throttling', () => {
    const results: boolean[] = []
    let targetElement: HTMLDivElement | null = null

    const {rerender} = render(
      <TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />,
    )

    // Initial state
    expect(results).toContain(false)

    // Trigger multiple resize events with different overflow states
    act(() => {
      if (targetElement) {
        triggerResizeOnElement(targetElement, false) // First: no overflow
        triggerResizeOnElement(targetElement, true) // Second: has overflow
        triggerResizeOnElement(targetElement, true) // Third: has overflow (latest)
      }
    })

    // Flush animation frame
    act(() => {
      flushAnimationFrames()
    })

    // After flushing, should have the latest state (overflow)
    rerender(<TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />)
    expect(results[results.length - 1]).toBe(true)
  })

  test('cancels pending animation frames on cleanup', () => {
    let targetElement: HTMLDivElement | null = null

    const {unmount} = render(<TestComponent onRef={el => (targetElement = el)} />)

    // Trigger a resize to schedule an animation frame
    act(() => {
      if (targetElement) {
        triggerResizeOnElement(targetElement, true)
      }
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Unmount before the animation frame executes
    unmount()

    // cancelAnimationFrame should have been called
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
  })

  test('does not cancel animation frame if none pending', () => {
    const {unmount} = render(<TestComponent />)

    // No resize events triggered after initial observation
    expect(requestAnimationFrame).toHaveBeenCalledTimes(0)

    unmount()

    // No cancelAnimationFrame should have been called
    expect(cancelAnimationFrame).not.toHaveBeenCalled()
  })

  test('schedules new animation frame after previous one completes', () => {
    let targetElement: HTMLDivElement | null = null

    render(<TestComponent onRef={el => (targetElement = el)} />)

    // First resize event
    act(() => {
      if (targetElement) {
        triggerResizeOnElement(targetElement, true)
      }
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Complete the animation frame
    act(() => {
      flushAnimationFrames()
    })

    // Second resize event
    act(() => {
      if (targetElement) {
        triggerResizeOnElement(targetElement, false)
      }
    })

    // New animation frame should be scheduled
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  test('detects vertical overflow (scrollHeight > clientHeight)', () => {
    const results: boolean[] = []
    let targetElement: HTMLDivElement | null = null

    const {rerender} = render(
      <TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />,
    )

    // Set up vertical overflow
    act(() => {
      if (targetElement) {
        Object.defineProperty(targetElement, 'scrollHeight', {value: 200, configurable: true})
        Object.defineProperty(targetElement, 'clientHeight', {value: 100, configurable: true})
        Object.defineProperty(targetElement, 'scrollWidth', {value: 100, configurable: true})
        Object.defineProperty(targetElement, 'clientWidth', {value: 100, configurable: true})
        triggerResizeOnElement(targetElement, true)
      }
    })

    act(() => {
      flushAnimationFrames()
    })

    rerender(<TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />)
    expect(results[results.length - 1]).toBe(true)
  })

  test('detects horizontal overflow (scrollWidth > clientWidth)', () => {
    const results: boolean[] = []
    let targetElement: HTMLDivElement | null = null

    const {rerender} = render(
      <TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />,
    )

    // Set up horizontal overflow
    act(() => {
      if (targetElement) {
        Object.defineProperty(targetElement, 'scrollHeight', {value: 100, configurable: true})
        Object.defineProperty(targetElement, 'clientHeight', {value: 100, configurable: true})
        Object.defineProperty(targetElement, 'scrollWidth', {value: 200, configurable: true})
        Object.defineProperty(targetElement, 'clientWidth', {value: 100, configurable: true})
        triggerResizeOnElement(targetElement, true)
      }
    })

    act(() => {
      flushAnimationFrames()
    })

    rerender(<TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />)
    expect(results[results.length - 1]).toBe(true)
  })

  test('returns false when ref.current is null', () => {
    const results: boolean[] = []

    function NullRefComponent({onResult}: {onResult: (result: boolean) => void}) {
      const ref = useRef<HTMLDivElement>(null)
      const result = useOverflow(ref)

      useEffect(() => {
        onResult(result)
      }, [result, onResult])

      // Don't render anything with the ref
      return null
    }

    render(<NullRefComponent onResult={result => results.push(result)} />)

    expect(results[0]).toBe(false)
    expect(mockObservedElements).toHaveLength(0)
  })

  test('clears latestEntries after processing to avoid memory leaks', () => {
    const results: boolean[] = []
    let targetElement: HTMLDivElement | null = null

    const {rerender} = render(
      <TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />,
    )

    // First resize event
    act(() => {
      if (targetElement) {
        Object.defineProperty(targetElement, 'scrollHeight', {value: 200, configurable: true})
        Object.defineProperty(targetElement, 'clientHeight', {value: 100, configurable: true})
        triggerResizeOnElement(targetElement, true)
      }
    })

    act(() => {
      flushAnimationFrames()
    })

    rerender(<TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />)
    expect(results[results.length - 1]).toBe(true)

    // Second resize event with different state
    act(() => {
      if (targetElement) {
        Object.defineProperty(targetElement, 'scrollHeight', {value: 100, configurable: true})
        Object.defineProperty(targetElement, 'clientHeight', {value: 100, configurable: true})
        triggerResizeOnElement(targetElement, false)
      }
    })

    act(() => {
      flushAnimationFrames()
    })

    rerender(<TestComponent onResult={result => results.push(result)} onRef={el => (targetElement = el)} />)
    // Should get the new state, not cached from before
    expect(results[results.length - 1]).toBe(false)
  })
})
