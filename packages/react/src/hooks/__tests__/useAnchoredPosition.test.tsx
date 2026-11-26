import {render, waitFor, act} from '@testing-library/react'
import {it, expect, vi, describe, beforeEach, afterEach} from 'vitest'
import {page} from 'vitest/browser'
import React, {startTransition} from 'react'
import {flushSync} from 'react-dom'
import type {ProfilerOnRenderCallback} from 'react'
import type {AnchorPosition, AnchorSide} from '@primer/behaviors'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'

const Component = ({
  callback,
  onPositionChange,
}: {
  callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
  onPositionChange?: () => void
}) => {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  callback(useAnchoredPosition({floatingElementRef, anchorElementRef, onPositionChange}))
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
    const onPositionChange = vi.fn()
    render(<Component callback={cb} onPositionChange={onPositionChange} />)

    // Wait for initial position calculation to stabilise
    await waitFor(() => {
      expect(cb).toHaveBeenCalledTimes(2)
    })
    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalled()
    })

    const callCountBefore = onPositionChange.mock.calls.length

    // Simulate a window scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    // The rAF-throttled handler recomputes the position. The position is unchanged,
    // so the recomputation is observable through onPositionChange rather than a re-render.
    await waitFor(() => {
      expect(onPositionChange.mock.calls.length).toBeGreaterThan(callCountBefore)
    })
  })

  it('should recalculate position when a scrollable ancestor scrolls', async () => {
    const ScrollableComponent = ({
      callback,
      onPositionChange,
    }: {
      callback: (hookReturnValue: ReturnType<typeof useAnchoredPosition>) => void
      onPositionChange: () => void
    }) => {
      const floatingElementRef = React.useRef<HTMLDivElement>(null)
      const anchorElementRef = React.useRef<HTMLDivElement>(null)
      callback(useAnchoredPosition({floatingElementRef, anchorElementRef, onPositionChange}))
      return (
        <div data-testid="scroll-container" style={{overflow: 'auto', height: '200px'}}>
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
    const onPositionChange = vi.fn()
    render(<ScrollableComponent callback={cb} onPositionChange={onPositionChange} />)

    await waitFor(() => {
      expect(cb).toHaveBeenCalledTimes(2)
    })
    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalled()
    })

    const callCountBefore = onPositionChange.mock.calls.length
    const scrollContainer = page.getByTestId('scroll-container').element()

    // Simulate scroll on the scrollable ancestor
    act(() => {
      scrollContainer.dispatchEvent(new Event('scroll'))
    })

    // The rAF-throttled handler recomputes the position. The position is unchanged,
    // so the recomputation is observable through onPositionChange rather than a re-render.
    await waitFor(() => {
      expect(onPositionChange.mock.calls.length).toBeGreaterThan(callCountBefore)
    })
  })
})

type FixtureProps = {
  side?: AnchorSide
  floatingHeight?: number
  anchorStyle?: React.CSSProperties
  pinPosition?: boolean
  enabled?: boolean
  floatingKey?: string
  floatingMounted?: boolean
  onPositionChange?: (position: AnchorPosition | undefined) => void
}

// The wrapper is the positioned parent. `flow-root` stops the anchor's margin from collapsing out of it.
// The spacer sits above the anchor in normal flow so tests can shift the anchor by resizing it.
const Fixture = ({
  side = 'outside-bottom',
  floatingHeight = 50,
  anchorStyle,
  pinPosition,
  enabled,
  floatingKey,
  floatingMounted = true,
  onPositionChange,
}: FixtureProps) => {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLDivElement>(null)
  const {position} = useAnchoredPosition({
    floatingElementRef,
    anchorElementRef,
    side,
    pinPosition,
    enabled,
    onPositionChange,
  })
  return (
    <div style={{position: 'relative', display: 'flow-root'}}>
      <div data-testid="spacer" style={{height: 0}} />
      <div
        data-testid="anchor"
        ref={anchorElementRef}
        style={{marginTop: 200, width: 100, height: 20, ...anchorStyle}}
      />
      {floatingMounted ? (
        <div
          key={floatingKey}
          data-testid="floating"
          ref={floatingElementRef}
          data-top={position?.top}
          data-left={position?.left}
          data-side={position?.anchorSide}
          style={{position: 'absolute', top: position?.top, left: position?.left, width: 50, height: floatingHeight}}
        />
      ) : null}
    </div>
  )
}

// The Profiler must sit above the component that owns the state so that onRender counts its commits.
const Harness = ({onCommit, ...props}: FixtureProps & {onCommit: ProfilerOnRenderCallback}) => (
  <React.Profiler id="fixture" onRender={onCommit}>
    <Fixture {...props} />
  </React.Profiler>
)

const getFloating = () => page.getByTestId('floating').element() as HTMLElement
const getSpacer = () => page.getByTestId('spacer').element() as HTMLElement
const readTop = () => getFloating().getAttribute('data-top')
const readLeft = () => getFloating().getAttribute('data-left')

describe('re-render behavior', () => {
  const documentSpacers: HTMLElement[] = []

  // The test page gives <body> `min-height: 100vh`, which would hide document height changes
  // and tie the document height to the viewport. Make the document content-sized like a typical page.
  beforeEach(() => {
    document.body.style.minHeight = '0'
  })

  afterEach(() => {
    document.body.style.minHeight = ''
    for (const spacer of documentSpacers.splice(0)) spacer.remove()
  })

  // Waits for the initial position and the resize observers' initial notifications to settle.
  const renderSettled = async (props: FixtureProps) => {
    const onPositionChange = vi.fn(props.onPositionChange)
    const onCommit = vi.fn()
    const result = render(<Harness {...props} onPositionChange={onPositionChange} onCommit={onCommit} />)
    await expect.poll(readTop).not.toBeNull()
    await expect.poll(() => onPositionChange.mock.calls.length).toBeGreaterThan(0)
    return {...result, onPositionChange, onCommit}
  }

  it('does not commit again when the document height changes but the anchor does not move', async () => {
    const {onPositionChange, onCommit} = await renderSettled({})

    const spacer = document.createElement('div')
    documentSpacers.push(spacer)
    document.body.append(spacer)

    const commitsBefore = onCommit.mock.calls.length
    for (const height of [1000, 2000, 500, 3000]) {
      const callsBefore = onPositionChange.mock.calls.length
      spacer.style.height = `${height}px`
      // onPositionChange firing proves the position was recomputed in response to the change
      await expect.poll(() => onPositionChange.mock.calls.length).toBeGreaterThan(callsBefore)
    }

    expect(onCommit).toHaveBeenCalledTimes(commitsBefore)
  })

  it('still calls onPositionChange with the position when a recompute leaves it unchanged', async () => {
    const {onPositionChange, onCommit} = await renderSettled({})
    const commitsBefore = onCommit.mock.calls.length
    const callsBefore = onPositionChange.mock.calls.length

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await expect.poll(() => onPositionChange.mock.calls.length).toBeGreaterThan(callsBefore)
    expect(onPositionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({anchorSide: 'outside-bottom', top: Number(readTop())}),
    )
    expect(onCommit).toHaveBeenCalledTimes(commitsBefore)
  })

  it('repositions when content above the anchor shifts it', async () => {
    await renderSettled({})
    const topBefore = Number(readTop())

    getSpacer().style.height = '100px'

    await expect.poll(() => Number(readTop())).toBe(topBefore + 100)
  })

  it('repositions when the floating element size changes', async () => {
    await renderSettled({side: 'outside-top'})
    const topBefore = Number(readTop())

    getFloating().style.height = '100px'

    // An outside-top overlay grows upwards, so its top moves up by the added height
    await expect.poll(() => Number(readTop())).toBe(topBefore - 50)
  })

  it('repositions when the viewport width changes', async () => {
    await page.viewport(1000, 800)
    await renderSettled({anchorStyle: {position: 'absolute', top: 100, left: '50%', marginTop: 0}})
    await expect.poll(readLeft).toBe('500')

    await page.viewport(600, 800)

    await expect.poll(readLeft).toBe('300')
  })

  it('repositions when only the viewport height changes', async () => {
    await page.viewport(1000, 800)
    await renderSettled({anchorStyle: {position: 'absolute', top: '50vh', left: 20, marginTop: 0}})
    await expect.poll(readTop).toBe('424')

    await page.viewport(1000, 500)

    await expect.poll(readTop).toBe('274')
  })

  it('restores the pinned height instead of moving when an outside-top overlay shrinks', async () => {
    await renderSettled({side: 'outside-top', floatingHeight: 100, pinPosition: true})
    const topBefore = readTop()

    getFloating().style.height = '50px'

    await expect.poll(() => getFloating().style.height).toBe('100px')
    expect(readTop()).toBe(topBefore)
  })

  it('does not pin a reopened floating element to the height of the previous one', async () => {
    const {rerender, onPositionChange, onCommit} = await renderSettled({
      side: 'outside-top',
      floatingHeight: 100,
      pinPosition: true,
      floatingKey: 'first',
    })
    const topBefore = Number(readTop())
    const rerenderWith = (props: FixtureProps) =>
      rerender(
        <Harness side="outside-top" pinPosition onPositionChange={onPositionChange} onCommit={onCommit} {...props} />,
      )

    // Mirrors AnchoredOverlay: the floating element unmounts while closed and a new, shorter one mounts on reopen
    rerenderWith({enabled: false, floatingHeight: 100, floatingKey: 'first'})
    rerenderWith({enabled: false, floatingHeight: 50, floatingKey: 'second'})
    rerenderWith({enabled: true, floatingHeight: 50, floatingKey: 'second'})

    // An outside-top overlay sits above its anchor, so a shorter one has a lower top
    await expect.poll(() => Number(readTop())).toBe(topBefore + 50)
    await new Promise(resolve => requestAnimationFrame(resolve))
    // The fixture renders the new height inline, so anything else is a pin to the old height
    expect(getFloating().style.height).toBe('50px')
  })

  describe('closing before the pinned height is restored', () => {
    // Holds back animation frames scheduled after this call so the test decides when they run.
    const holdAnimationFrames = () => {
      const queued = new Map<number, FrameRequestCallback>()
      let nextId = 1
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        queued.set(nextId, callback)
        return nextId++
      })
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
        queued.delete(id)
      })
      return {
        pending: () => queued.size,
        requested: () => nextId - 1,
        run: () => {
          const callbacks = [...queued.values()]
          queued.clear()
          for (const callback of callbacks) callback(performance.now())
        },
      }
    }

    afterEach(() => {
      vi.restoreAllMocks()
    })

    const shrinkWhilePinned = async () => {
      const result = await renderSettled({side: 'outside-top', floatingHeight: 100, pinPosition: true})
      const frames = holdAnimationFrames()
      const runFrames = frames.run
      const requestedFrames = frames.requested
      const topBefore = readTop()
      getFloating().style.height = '50px'
      // The shrink is detected and the height restoration is scheduled, but has not run yet
      await expect.poll(frames.pending).toBeGreaterThan(0)
      const rerenderWith = (props: FixtureProps) =>
        result.rerender(
          <Harness
            side="outside-top"
            pinPosition
            onPositionChange={result.onPositionChange}
            onCommit={result.onCommit}
            {...props}
          />,
        )
      return {runFrames, requestedFrames, rerenderWith, topBefore, ...result}
    }

    it('does not throw when the overlay closes before the frame runs', async () => {
      const {runFrames, rerenderWith} = await shrinkWhilePinned()

      rerenderWith({enabled: false, floatingMounted: false})

      expect(() => runFrames()).not.toThrow()
    })

    it('does not resize a replacement element when the overlay reopens before the frame runs', async () => {
      const {runFrames, rerenderWith} = await shrinkWhilePinned()

      rerenderWith({enabled: false, floatingMounted: false})
      rerenderWith({enabled: true, floatingHeight: 30, floatingKey: 'second'})
      runFrames()

      expect(getFloating().style.height).toBe('30px')
    })

    it('restores the original height and keeps the top when it shrinks again before the frame runs', async () => {
      const {runFrames, requestedFrames, topBefore, onCommit} = await shrinkWhilePinned()
      const commitsBefore = onCommit.mock.calls.length
      const requestedBefore = requestedFrames()

      getFloating().style.height = '30px'
      // The recompute for the second shrink schedules its own restoration
      await expect.poll(requestedFrames).toBeGreaterThan(requestedBefore)
      expect(readTop()).toBe(topBefore)
      expect(onCommit).toHaveBeenCalledTimes(commitsBefore)

      runFrames()

      expect(getFloating().style.height).toBe('100px')
      expect(readTop()).toBe(topBefore)
    })

    it('does not shrink a floating element that grew back before the frame runs', async () => {
      const {runFrames} = await shrinkWhilePinned()

      getFloating().style.height = '120px'
      runFrames()

      expect(getFloating().style.height).toBe('120px')
    })

    it('restores the newly measured height when it grew past the pending height and shrinks again', async () => {
      const {runFrames, requestedFrames, topBefore} = await shrinkWhilePinned()

      getFloating().style.height = '120px'
      // An outside-top overlay grows upwards, so its top moves up by the added height
      await expect.poll(() => Number(readTop())).toBe(Number(topBefore) - 20)
      const topGrown = readTop()
      const requestedBefore = requestedFrames()

      getFloating().style.height = '110px'
      await expect.poll(requestedFrames).toBeGreaterThan(requestedBefore)
      expect(readTop()).toBe(topGrown)

      runFrames()

      expect(getFloating().style.height).toBe('120px')
      expect(readTop()).toBe(topGrown)
    })

    it('keeps the shrunk height and repositions when pinning is turned off before the frame runs', async () => {
      const {runFrames, rerenderWith, topBefore} = await shrinkWhilePinned()

      rerenderWith({pinPosition: false, floatingHeight: 100})
      runFrames()

      expect(getFloating().style.height).toBe('50px')
      await expect.poll(() => Number(readTop())).toBe(Number(topBefore) + 50)
    })
  })

  describe('low-priority recompute replayed after pinning is turned off', () => {
    let setPinned: (pinned: boolean) => void = () => {}
    let setBump: (n: number) => void = () => {}
    const TransitionFixture = () => {
      const [pinned, setPinnedState] = React.useState(true)
      const [bump, setBumpState] = React.useState(0)
      React.useEffect(() => {
        setPinned = setPinnedState
        setBump = setBumpState
      }, [])
      const floatingElementRef = React.useRef<HTMLDivElement>(null)
      const anchorElementRef = React.useRef<HTMLDivElement>(null)
      const {position} = useAnchoredPosition({
        floatingElementRef,
        anchorElementRef,
        side: 'outside-top',
        pinPosition: pinned,
      })
      return (
        <div style={{position: 'relative', display: 'flow-root'}}>
          <div ref={anchorElementRef} style={{marginTop: 200, width: 100, height: 20}} />
          <div
            data-testid="floating"
            data-bump={bump}
            data-top={position?.top}
            ref={floatingElementRef}
            style={{position: 'absolute', top: position?.top, left: position?.left, width: 50, height: 100}}
          />
        </div>
      )
    }

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('does not restore the old height after pinning was turned off', async () => {
      await page.viewport(1000, 800)
      render(<TransitionFixture />)
      await expect.poll(readTop).not.toBeNull()
      // Lets the viewport change and the resize observers' initial notifications settle, so none lands inside the block below.
      await new Promise(resolve => setTimeout(resolve, 500))

      const queued = new Map<number, FrameRequestCallback>()
      let nextId = 1
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        queued.set(nextId, callback)
        return nextId++
      })
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
        queued.delete(id)
      })

      const floating = getFloating()
      const previous = (globalThis as {IS_REACT_ACT_ENVIRONMENT?: boolean}).IS_REACT_ACT_ENVIRONMENT
      ;(globalThis as {IS_REACT_ACT_ENVIRONMENT?: boolean}).IS_REACT_ACT_ENVIRONMENT = false
      try {
        // One synchronous block so nothing low-priority renders in between.
        flushSync(() => {})
        floating.style.height = '50px'
        // A pending transition on the same component keeps the next position update from being computed eagerly.
        startTransition(() => setBump(1))
        startTransition(() => {
          window.dispatchEvent(new Event('resize'))
        })
        flushSync(() => setPinned(false))

        // Wait for the transition to render and commit.
        await expect.poll(() => floating.getAttribute('data-bump')).toBe('1')
        await new Promise(resolve => setTimeout(resolve, 50))
      } finally {
        ;(globalThis as {IS_REACT_ACT_ENVIRONMENT?: boolean}).IS_REACT_ACT_ENVIRONMENT = previous
      }

      for (const callback of [...queued.values()]) callback(performance.now())

      expect(floating.style.height).toBe('50px')
    })
  })

  it('repositions when side changes while open', async () => {
    const {rerender, onPositionChange, onCommit} = await renderSettled({})
    expect(getFloating().getAttribute('data-side')).toBe('outside-bottom')

    rerender(<Harness side="outside-top" onPositionChange={onPositionChange} onCommit={onCommit} />)

    await expect.poll(() => getFloating().getAttribute('data-side')).toBe('outside-top')
  })
})
