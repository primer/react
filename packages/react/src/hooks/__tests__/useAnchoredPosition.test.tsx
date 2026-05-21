import {render, waitFor, act} from '@testing-library/react'
import {it, expect, vi, describe, beforeEach, afterEach} from 'vitest'
import React from 'react'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'

type MockedAnchorPosition = {
  anchorAlign: string
  anchorSide: string
  left: number
  top: number
}

type BehaviorsModule = Record<string, unknown> & {
  getAnchoredPosition: (...args: unknown[]) => MockedAnchorPosition
}

const {mockedGetAnchoredPosition} = vi.hoisted(() => ({
  mockedGetAnchoredPosition: vi.fn(),
}))

vi.mock('@primer/behaviors', async importOriginal => {
  const actual = (await importOriginal()) as BehaviorsModule

  return {
    ...actual,
    getAnchoredPosition: (...args: unknown[]) => {
      const implementation = mockedGetAnchoredPosition.getMockImplementation()

      if (implementation) {
        return mockedGetAnchoredPosition(...args)
      }

      return actual.getAnchoredPosition(...args)
    },
  }
})

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

const PinPositionComponent = ({
  callback,
  step,
}: {
  callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  step: number
}) => {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef, pinPosition: true}, [step]))

  return (
    <div>
      <div ref={floatingElementRef} />
      <div ref={anchorElementRef} />
    </div>
  )
}

beforeEach(() => {
  mockedGetAnchoredPosition.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})

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

it('should defer initial updatePosition to useEffect when overlay is closed on mount', async () => {
  // When no floating element is present (overlay closed), the initial
  // updatePosition call should be deferred from useLayoutEffect to useEffect.
  // We verify this by checking that onPositionChange has NOT been called by
  // the time the component's own useLayoutEffect runs (which fires after the
  // hook's useLayoutEffect in declaration order).
  const onPositionChange = vi.fn()
  const layoutPhaseCheck = vi.fn()

  const ClosedOverlayComponent = ({
    onPositionChangeProp,
    onLayoutEffect,
  }: {
    onPositionChangeProp: typeof onPositionChange
    onLayoutEffect: (calledDuringLayout: boolean) => void
  }) => {
    const floatingElementRef = React.useRef<HTMLDivElement>(null)
    const anchorElementRef = React.useRef<HTMLDivElement>(null)
    useAnchoredPosition({floatingElementRef, anchorElementRef, onPositionChange: onPositionChangeProp})

    // This layout effect runs after the hook's layout effects (declaration order).
    // With the fix, onPositionChange should NOT have been called yet because
    // the initial updatePosition is deferred to useEffect.
    React.useLayoutEffect(() => {
      onLayoutEffect(onPositionChangeProp.mock.calls.length > 0)
    }, [onPositionChangeProp, onLayoutEffect])

    return <div />
  }

  render(<ClosedOverlayComponent onPositionChangeProp={onPositionChange} onLayoutEffect={layoutPhaseCheck} />)

  // onPositionChange should not have fired during the layout phase
  expect(layoutPhaseCheck).toHaveBeenCalledWith(false)

  // After effects run, onPositionChange should have been called with undefined
  await waitFor(() => {
    expect(onPositionChange).toHaveBeenCalledWith(undefined)
  })
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

describe('pinPosition', () => {
  it('allows outside-top overlays to grow when content needs more height', async () => {
    const callback = vi.fn()
    let currentTop = 200
    let floatingHeight = 147
    let floatingScrollHeight = 147
    let overflowingDescendantHeight = 147
    let overflowingDescendantScrollHeight = 147

    mockedGetAnchoredPosition.mockImplementation(() => ({
      anchorAlign: 'start',
      anchorSide: 'outside-top',
      left: 0,
      top: currentTop,
    }))

    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(0)
      return 0
    })

    const {container, rerender} = render(<PinPositionComponent callback={callback} step={0} />)
    const [floatingElement, anchorElement] = Array.from(container.firstElementChild!.children) as [
      HTMLDivElement,
      HTMLDivElement,
    ]
    const overflowingDescendant = document.createElement('div')
    floatingElement.append(overflowingDescendant)

    Object.defineProperty(floatingElement, 'clientHeight', {configurable: true, get: () => floatingHeight})
    Object.defineProperty(floatingElement, 'scrollHeight', {configurable: true, get: () => floatingScrollHeight})
    Object.defineProperty(overflowingDescendant, 'clientHeight', {
      configurable: true,
      get: () => overflowingDescendantHeight,
    })
    Object.defineProperty(overflowingDescendant, 'scrollHeight', {
      configurable: true,
      get: () => overflowingDescendantScrollHeight,
    })
    Object.defineProperty(anchorElement, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({top: 500}),
    })

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(200)
    })

    rerender(<PinPositionComponent callback={callback} step={1} />)

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(200)
    })

    currentTop = 210
    floatingHeight = 91
    floatingScrollHeight = 91
    overflowingDescendantHeight = 91
    overflowingDescendantScrollHeight = 317
    rerender(<PinPositionComponent callback={callback} step={2} />)

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(210)
    })

    expect(floatingElement.style.height).toBe('')
    expect(requestAnimationFrameSpy).toHaveBeenCalled()
  })

  it('keeps the previous height when outside-top content is genuinely shrinking', async () => {
    const callback = vi.fn()
    let currentTop = 200
    let floatingHeight = 147
    let floatingScrollHeight = 147

    mockedGetAnchoredPosition.mockImplementation(() => ({
      anchorAlign: 'start',
      anchorSide: 'outside-top',
      left: 0,
      top: currentTop,
    }))

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callback(0)
      return 0
    })

    const {container, rerender} = render(<PinPositionComponent callback={callback} step={0} />)
    const [floatingElement, anchorElement] = Array.from(container.firstElementChild!.children) as [
      HTMLDivElement,
      HTMLDivElement,
    ]

    Object.defineProperty(floatingElement, 'clientHeight', {configurable: true, get: () => floatingHeight})
    Object.defineProperty(floatingElement, 'scrollHeight', {configurable: true, get: () => floatingScrollHeight})
    Object.defineProperty(anchorElement, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({top: 500}),
    })

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(200)
    })

    rerender(<PinPositionComponent callback={callback} step={1} />)

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(200)
    })

    currentTop = 210
    floatingHeight = 91
    floatingScrollHeight = 91
    rerender(<PinPositionComponent callback={callback} step={2} />)

    await waitFor(() => {
      expect(callback.mock.lastCall?.[0].position.top).toBe(200)
    })

    expect(floatingElement.style.height).toBe('147px')
  })
})
