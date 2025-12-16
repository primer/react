import {render, act} from '@testing-library/react'
import {useRef, useEffect} from 'react'
import {describe, expect, test, vi, beforeEach, afterEach} from 'vitest'
import {useResizeObserver} from '../useResizeObserver'

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

// Helper to trigger resize events
function triggerResize(entries: ResizeObserverEntry[]) {
  if (mockResizeObserverCallback) {
    mockResizeObserverCallback(entries, {} as ResizeObserver)
  }
}

// Helper to create mock resize entries
function createMockEntry(width: number, height: number, target?: Element): ResizeObserverEntry {
  return {
    target: target || document.createElement('div'),
    contentRect: {
      width,
      height,
      top: 0,
      left: 0,
      bottom: height,
      right: width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    },
    borderBoxSize: [],
    contentBoxSize: [],
    devicePixelContentBoxSize: [],
  }
}

describe('useResizeObserver', () => {
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
      // In a real implementation, we'd remove the callback, but for tests we just track the call
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

  test('fires callback immediately on first observation', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)

    // Callback should have been called immediately (synchronously) on observe
    expect(callback).toHaveBeenCalledTimes(1)
    // Should have been called with entries containing contentRect
    expect(callback.mock.calls[0][0][0]).toHaveProperty('contentRect')
  })

  test('fires callback immediately for target ref on first observation', () => {
    const callback = vi.fn()

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(callback, ref)
      return <div ref={ref} data-testid="target" />
    }

    render(<TestComponent />)

    // Callback should have been called immediately
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('throttles subsequent callbacks using requestAnimationFrame', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)

    // First callback was immediate
    expect(callback).toHaveBeenCalledTimes(1)
    callback.mockClear()

    // Trigger multiple rapid resize events
    act(() => {
      triggerResize([createMockEntry(100, 100)])
      triggerResize([createMockEntry(200, 200)])
      triggerResize([createMockEntry(300, 300)])
    })

    // Callback should not have been called yet (throttled)
    expect(callback).toHaveBeenCalledTimes(0)

    // requestAnimationFrame should have been called once
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Flush the animation frame
    act(() => {
      flushAnimationFrames()
    })

    // Now callback should have been called once with the latest entries
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback.mock.calls[0][0][0].contentRect.width).toBe(300)
    expect(callback.mock.calls[0][0][0].contentRect.height).toBe(300)
  })

  test('processes latest entries after throttling, not stale ones', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)
    callback.mockClear()

    // Trigger first resize event
    act(() => {
      triggerResize([createMockEntry(100, 100)])
    })

    // Before rAF executes, trigger more resize events
    act(() => {
      triggerResize([createMockEntry(150, 150)])
      triggerResize([createMockEntry(200, 200)])
    })

    // Only one rAF should be pending
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Flush and verify we get the latest entry
    act(() => {
      flushAnimationFrames()
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback.mock.calls[0][0][0].contentRect.width).toBe(200)
  })

  test('cancels pending animation frames on cleanup', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    const {unmount} = render(<TestComponent />)
    callback.mockClear()

    // Trigger a resize to schedule an animation frame
    act(() => {
      triggerResize([createMockEntry(100, 100)])
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Unmount before the animation frame executes
    unmount()

    // cancelAnimationFrame should have been called
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1) // First rAF ID
  })

  test('does not cancel animation frame on cleanup if none pending', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    const {unmount} = render(<TestComponent />)

    // Only the initial immediate callback, no rAF scheduled
    expect(requestAnimationFrame).toHaveBeenCalledTimes(0)

    unmount()

    // No cancelAnimationFrame should have been called
    expect(cancelAnimationFrame).not.toHaveBeenCalled()
  })

  test('schedules new animation frame after previous one completes', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)
    callback.mockClear()

    // First batch of resize events
    act(() => {
      triggerResize([createMockEntry(100, 100)])
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    // Complete the animation frame
    act(() => {
      flushAnimationFrames()
    })

    expect(callback).toHaveBeenCalledTimes(1)

    // Second batch of resize events
    act(() => {
      triggerResize([createMockEntry(200, 200)])
    })

    // New animation frame should be scheduled
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2)

    act(() => {
      flushAnimationFrames()
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('uses document.documentElement as default target', () => {
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)

    expect(mockObservedElements).toContain(document.documentElement)
  })

  test('uses provided ref as target', () => {
    const callback = vi.fn()
    let targetElement: HTMLDivElement | null = null

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      useResizeObserver(callback, ref)

      useEffect(() => {
        targetElement = ref.current
      })

      return <div ref={ref} data-testid="target" />
    }

    render(<TestComponent />)

    expect(mockObservedElements).toContain(targetElement)
  })

  test('updates savedCallback ref when callback changes', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    function TestComponent({callback}: {callback: (entries: ResizeObserverEntry[]) => void}) {
      useResizeObserver(callback)
      return null
    }

    const {rerender} = render(<TestComponent callback={callback1} />)

    // First callback should have been called
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(0)

    callback1.mockClear()

    // Update callback
    rerender(<TestComponent callback={callback2} />)

    // Trigger resize
    act(() => {
      triggerResize([createMockEntry(100, 100)])
    })

    act(() => {
      flushAnimationFrames()
    })

    // New callback should be called
    expect(callback1).toHaveBeenCalledTimes(0)
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  test('clears latestEntries after processing to avoid memory leaks', () => {
    // This test verifies the fix for the memory leak issue
    // We can't directly observe latestEntries, but we can verify behavior
    const callback = vi.fn()

    function TestComponent() {
      useResizeObserver(callback)
      return null
    }

    render(<TestComponent />)
    callback.mockClear()

    // Trigger resize
    act(() => {
      triggerResize([createMockEntry(100, 100)])
    })

    // Flush animation frame
    act(() => {
      flushAnimationFrames()
    })

    expect(callback).toHaveBeenCalledTimes(1)

    // Trigger another resize and flush immediately
    act(() => {
      triggerResize([createMockEntry(200, 200)])
    })

    act(() => {
      flushAnimationFrames()
    })

    // Should get the new entry, not the old one
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback.mock.calls[1][0][0].contentRect.width).toBe(200)
  })
})
