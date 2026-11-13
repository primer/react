import React from 'react'
import {createPortal} from 'react-dom'
import {act, render, renderHook} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {usePaneWidth, type PaneWidthValue} from './usePaneWidth'

describe('usePaneWidth viewport constraints', () => {
  const width = {min: '240px', default: '300px', max: '480px'} as const

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function renderPane(paneWidth: PaneWidthValue, constrainToViewport = false, ownerDocument = document) {
    const pane = ownerDocument.createElement('div')
    const handle = ownerDocument.createElement('div')
    const paneRef = {current: pane}
    const handleRef = {current: handle}
    const onResizeEnd = vi.fn()
    const hook = renderHook(() =>
      usePaneWidth({
        width: paneWidth,
        minWidth: 240,
        resizable: true,
        constrainToViewport,
        paneRef,
        handleRef,
        onResizeEnd,
      }),
    )
    return {...hook, pane, handle, onResizeEnd}
  }

  function renderResponsivePane(ownerDocument = document) {
    const pane = ownerDocument.createElement('div')
    const paneRef = {current: pane}
    const handleRef = {current: null}
    const hook = renderHook(() => usePaneWidth({width: 'medium', minWidth: 240, resizable: false, paneRef, handleRef}))
    return {...hook, pane}
  }

  function MovingPane({
    target,
    resizable,
    showHandle = true,
    paneKey,
  }: {
    target: Document | null
    resizable: boolean
    showHandle?: boolean
    paneKey?: string
  }) {
    const paneRef = React.useRef<HTMLDivElement>(null)
    const handleRef = React.useRef<HTMLDivElement>(null)
    const {currentWidth, maxPaneWidth} = usePaneWidth({
      width: resizable ? width : 'medium',
      minWidth: 240,
      resizable,
      constrainToViewport: true,
      paneRef,
      handleRef,
    })
    if (!target) return null
    return createPortal(
      <div
        key={paneKey}
        ref={paneRef}
        data-testid="moving-pane"
        data-width={currentWidth}
        data-max-width={maxPaneWidth}
      >
        {showHandle && <div ref={handleRef} data-testid="moving-handle" />}
      </div>,
      target.body,
    )
  }

  it.each([
    [300, 240],
    [800, 289],
    [990, 479],
    [991, 480],
    [1279, 480],
    [1280, 321],
    [1438, 479],
    [1439, 480],
    [2000, 480],
  ])('caps a custom width at viewport %i to %i pixels', (viewport, expected) => {
    vi.stubGlobal('innerWidth', viewport)
    const {result, pane, handle} = renderPane(width, true)
    expect(result.current.getMaxPaneWidth()).toBe(expected)
    expect(result.current.maxPaneWidth).toBe(expected)
    expect(pane).toHaveStyle(`--pane-max-width: ${expected}px`)
    expect(handle).toHaveAttribute('aria-valuemax', String(expected))
  })

  it('keeps a custom maximum when viewport constraints are disabled', () => {
    vi.stubGlobal('innerWidth', 800)
    const {result} = renderPane(width)
    expect(result.current.getMaxPaneWidth()).toBe(480)
  })

  it('uses the breakpoint-dependent reservation for preset widths', () => {
    vi.stubGlobal('innerWidth', 1280)
    const {result} = renderPane('medium')
    expect(result.current.getMaxPaneWidth()).toBe(321)
  })

  it('uses and subscribes to the pane document viewport instead of its parent document', () => {
    vi.stubGlobal('innerWidth', 1440)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument
    const frameWindow = frame.contentWindow
    if (!frameDocument || !frameWindow) throw new Error('Expected an accessible frame')
    Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 1024})
    try {
      const {result, handle} = renderPane('medium', false, frameDocument)
      expect(result.current.getMaxPaneWidth()).toBe(513)
      expect(handle).toHaveAttribute('aria-valuemax', '513')
      Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 800})
      act(() => {
        frameWindow.dispatchEvent(new Event('resize'))
      })
      expect(result.current.getMaxPaneWidth()).toBe(289)
      expect(handle).toHaveAttribute('aria-valuemax', '289')
    } finally {
      frame.remove()
    }
  })

  it('updates the limit and clamps the width when the viewport crosses the breakpoint', () => {
    vi.stubGlobal('innerWidth', 1280)
    const {result, pane, handle, onResizeEnd} = renderPane(width, true)
    expect(result.current.maxPaneWidth).toBe(321)
    act(() => result.current.saveWidth(320))
    onResizeEnd.mockClear()

    vi.stubGlobal('innerWidth', 800)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.getMaxPaneWidth()).toBe(289)
    expect(result.current.maxPaneWidth).toBe(289)
    expect(result.current.currentWidth).toBe(289)
    expect(pane).toHaveStyle('--pane-width: 289px; --pane-max-width: 289px')
    expect(handle).toHaveAttribute('aria-valuenow', '289')
    expect(handle).toHaveAttribute('aria-valuemax', '289')
    expect(onResizeEnd).not.toHaveBeenCalled()
  })

  it('restores the constrained controlled width after a custom handle commits', () => {
    vi.stubGlobal('innerWidth', 800)
    const pane = document.createElement('div')
    const handle = document.createElement('div')
    const paneRef = {current: pane}
    const handleRef = {current: handle}
    const onResizeEnd = vi.fn()
    const formatValueText = (value: number) => `Width: ${value}`
    const {result} = renderHook(() =>
      usePaneWidth({
        width,
        minWidth: 240,
        resizable: true,
        constrainToViewport: true,
        currentWidth: 400,
        onResizeEnd,
        paneRef,
        handleRef,
        formatValueText,
      }),
    )
    handle.setAttribute('data-dragging', 'true')

    act(() => result.current.saveWidth(270))
    expect(onResizeEnd).toHaveBeenLastCalledWith(270)
    expect(result.current.currentWidthRef.current).toBe(289)
    expect(pane).toHaveStyle('--pane-width: 289px; --pane-max-width: 289px')
    expect(handle).toHaveAttribute('aria-valuenow', '289')
    expect(handle).toHaveAttribute('aria-valuetext', 'Width: 289')
  })

  it('restores the controlled width and propagates an onResizeEnd error', () => {
    vi.stubGlobal('innerWidth', 1024)
    const pane = document.createElement('div')
    const handle = document.createElement('div')
    const paneRef = {current: pane}
    const handleRef = {current: handle}
    const error = new Error('Unable to save width')
    const onResizeEnd = () => {
      throw error
    }
    const {result} = renderHook(() =>
      usePaneWidth({
        width,
        minWidth: 240,
        resizable: true,
        currentWidth: 300,
        onResizeEnd,
        paneRef,
        handleRef,
      }),
    )
    pane.style.setProperty('--pane-width', '303px')
    handle.setAttribute('aria-valuenow', '303')

    expect(() => act(() => result.current.saveWidth(303))).toThrow(error)
    expect(result.current.currentWidthRef.current).toBe(300)
    expect(pane).toHaveStyle('--pane-width: 300px')
    expect(handle).toHaveAttribute('aria-valuenow', '300')
  })

  it('updates responsive preset widths on viewport resize without ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('innerWidth', 1280)
    const {result} = renderResponsivePane()
    expect(result.current.currentWidth).toBe(296)

    act(() => {
      vi.stubGlobal('innerWidth', 800)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.currentWidth).toBe(256)

    act(() => {
      vi.stubGlobal('innerWidth', 1280)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.currentWidth).toBe(296)
  })

  it.each([
    [1012, 1011, 296, 256],
    [1011, 1012, 256, 296],
  ])('updates responsive preset width across %i to %i pixels', (initial, next, initialWidth, nextWidth) => {
    vi.stubGlobal('innerWidth', initial)
    const {result} = renderResponsivePane()
    expect(result.current.currentWidth).toBe(initialWidth)
    act(() => {
      vi.stubGlobal('innerWidth', next)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.currentWidth).toBe(nextWidth)
  })

  it('updates resizable limits when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('innerWidth', 1280)
    const {result, handle} = renderPane(width, true)
    expect(result.current.maxPaneWidth).toBe(321)

    act(() => {
      vi.stubGlobal('innerWidth', 800)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.maxPaneWidth).toBe(289)
    expect(handle).toHaveAttribute('aria-valuemax', '289')
  })

  it('reads and subscribes to the responsive pane document viewport', () => {
    vi.stubGlobal('innerWidth', 800)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument
    const frameWindow = frame.contentWindow
    if (!frameDocument || !frameWindow) throw new Error('Expected an accessible frame')
    Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 1024})
    const add = vi.spyOn(frameWindow, 'addEventListener')
    const remove = vi.spyOn(frameWindow, 'removeEventListener')
    try {
      const {result, unmount} = renderResponsivePane(frameDocument)
      const resizeListeners = add.mock.calls.filter(([event]) => event === 'resize').map(([, listener]) => listener)
      expect(resizeListeners).toHaveLength(1)
      expect(result.current.currentWidth).toBe(296)

      act(() => {
        Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 800})
        frameWindow.dispatchEvent(new Event('resize'))
      })
      expect(result.current.currentWidth).toBe(256)

      act(() => {
        Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 1200})
        frameWindow.dispatchEvent(new Event('resize'))
      })
      expect(result.current.currentWidth).toBe(296)
      unmount()
      expect(remove).toHaveBeenCalledWith('resize', resizeListeners[0])
    } finally {
      add.mockRestore()
      remove.mockRestore()
      frame.remove()
    }
  })

  it.each([
    ['responsive', 'late attachment', false],
    ['responsive', 'document change', false],
    ['resizable', 'late attachment', true],
    ['resizable', 'document change', true],
  ] as const)('updates the owning viewport after a %s pane %s', (_kind, transition, resizable) => {
    vi.stubGlobal('innerWidth', 1280)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument
    const frameWindow = frame.contentWindow
    if (!frameDocument || !frameWindow) throw new Error('Expected an accessible frame')
    Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: 800})
    const addParent = vi.spyOn(window, 'addEventListener')
    const removeParent = vi.spyOn(window, 'removeEventListener')
    const addFrame = vi.spyOn(frameWindow, 'addEventListener')
    const removeFrame = vi.spyOn(frameWindow, 'removeEventListener')
    const {rerender, unmount} = render(
      <MovingPane target={transition === 'late attachment' ? null : document} resizable={resizable} />,
    )
    try {
      const parentListeners = addParent.mock.calls
        .filter(([event]) => event === 'resize')
        .map(([, listener]) => listener)
      expect(parentListeners.length).toBeGreaterThan(0)
      rerender(<MovingPane target={frameDocument} resizable={resizable} />)
      for (const listener of parentListeners) expect(removeParent).toHaveBeenCalledWith('resize', listener)
      const frameListeners = addFrame.mock.calls.filter(([event]) => event === 'resize').map(([, listener]) => listener)
      expect(frameListeners.length).toBeGreaterThan(0)
      const pane = frameDocument.querySelector('[data-testid="moving-pane"]')
      const handle = frameDocument.querySelector('[data-testid="moving-handle"]')
      expect(pane).toHaveAttribute('data-width', resizable ? '289' : '256')
      if (resizable) {
        expect(pane).toHaveAttribute('data-max-width', '289')
        expect(handle).toHaveAttribute('aria-valuemax', '289')
      }
      act(() => {
        Object.defineProperty(frameWindow, 'innerWidth', {configurable: true, value: resizable ? 1000 : 1200})
        frameWindow.dispatchEvent(new Event('resize'))
      })
      if (resizable) {
        expect(pane).toHaveAttribute('data-max-width', '480')
        expect(handle).toHaveAttribute('aria-valuemax', '480')
      } else {
        expect(pane).toHaveAttribute('data-width', '296')
      }
      unmount()
      for (const listener of frameListeners) expect(removeFrame).toHaveBeenCalledWith('resize', listener)
    } finally {
      unmount()
      addParent.mockRestore()
      removeParent.mockRestore()
      addFrame.mockRestore()
      removeFrame.mockRestore()
      frame.remove()
    }
  })

  it('updates a resizable pane when its target attaches late or is replaced in the same document', () => {
    vi.stubGlobal('innerWidth', 800)
    const {rerender} = render(<MovingPane target={null} resizable />)
    rerender(<MovingPane target={document} paneKey="first" resizable />)
    expect(document.querySelector('[data-testid="moving-pane"]')).toHaveStyle('--pane-max-width: 289px')
    expect(document.querySelector('[data-testid="moving-handle"]')).toHaveAttribute('aria-valuemax', '289')

    rerender(<MovingPane target={document} paneKey="second" resizable />)
    expect(document.querySelector('[data-testid="moving-pane"]')).toHaveStyle('--pane-max-width: 289px')
    expect(document.querySelector('[data-testid="moving-handle"]')).toHaveAttribute('aria-valuemax', '289')
  })

  it('updates a resizable handle that attaches after its pane', () => {
    vi.stubGlobal('innerWidth', 800)
    const {rerender} = render(<MovingPane target={document} showHandle={false} resizable />)
    rerender(<MovingPane target={document} resizable />)
    expect(document.querySelector('[data-testid="moving-handle"]')).toHaveAttribute('aria-valuemax', '289')
  })

  it.each(['responsive', 'resizable'] as const)('removes its %s viewport subscription on unmount', kind => {
    vi.stubGlobal('innerWidth', 1280)
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    try {
      const {unmount} = kind === 'responsive' ? renderResponsivePane() : renderPane('medium')
      const resizeListeners = add.mock.calls.filter(([event]) => event === 'resize').map(([, listener]) => listener)
      expect(resizeListeners.length).toBeGreaterThan(0)
      unmount()
      for (const listener of resizeListeners) expect(remove).toHaveBeenCalledWith('resize', listener)
    } finally {
      add.mockRestore()
      remove.mockRestore()
    }
  })
})
