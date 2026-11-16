import {act, fireEvent, render, screen} from '@testing-library/react'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {DragHandle} from './DragHandle'

function pointerEvent(
  type: string,
  {button = 0, clientX = 0, pointerId = 1}: {button?: number; clientX?: number; pointerId?: number} = {},
) {
  const event = new MouseEvent(type, {bubbles: true, cancelable: true, button, clientX})
  Object.defineProperty(event, 'pointerId', {value: pointerId})
  return event
}

afterEach(() => vi.restoreAllMocks())

describe('DragHandle drag-state composition', () => {
  it('marks both supplied targets while resizing with the keyboard', () => {
    const pane = document.createElement('div')
    const content = document.createElement('div')
    const handleRef = React.createRef<HTMLDivElement>()
    const onDragStart = vi.fn()
    const onDrag = vi.fn()
    const onDragEnd = vi.fn()
    render(
      <DragHandle
        handleRef={handleRef}
        dragTargetRef={{current: pane}}
        contentWrapperRef={{current: content}}
        aria-label="Resize pane"
        data-purpose="pane-resize"
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />,
    )
    const handle = screen.getByRole('slider', {name: 'Resize pane'})
    expect(handleRef.current).toBe(handle)
    expect(handle).toHaveAttribute('data-purpose', 'pane-resize')
    expect(handle).toHaveAttribute('data-component', 'PageLayout.DragHandle')
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(content).not.toHaveAttribute('data-dragging')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(handle).toHaveAttribute('data-dragging')
    expect(pane).toHaveAttribute('data-dragging', 'true')
    expect(content).toHaveAttribute('data-dragging', 'true')
    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDrag).toHaveBeenCalledWith(3, true)

    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(handle).not.toHaveAttribute('data-dragging')
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(content).not.toHaveAttribute('data-dragging')
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('marks supplied targets until pointer capture is lost', () => {
    const pane = document.createElement('div')
    const content = document.createElement('div')
    const onDragStart = vi.fn()
    const onDragEnd = vi.fn()
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        dragTargetRef={{current: pane}}
        contentWrapperRef={{current: content}}
        onDragStart={onDragStart}
        onDrag={vi.fn()}
        onDragEnd={onDragEnd}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()

    fireEvent(handle, pointerEvent('pointerdown', {button: 2, clientX: 70}))
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(onDragStart).not.toHaveBeenCalled()

    fireEvent(handle, pointerEvent('pointerdown', {clientX: 70}))
    expect(handle.setPointerCapture).toHaveBeenCalledWith(1)
    expect(onDragStart).toHaveBeenCalledExactlyOnceWith(70)
    expect(pane).toHaveAttribute('data-dragging', 'true')
    expect(content).toHaveAttribute('data-dragging', 'true')

    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(handle).not.toHaveAttribute('data-dragging')
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(content).not.toHaveAttribute('data-dragging')
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('keeps a shared target marked until every active handle finishes', () => {
    const target = document.createElement('div')
    target.setAttribute('data-dragging', 'previous')
    const sharedRef = {current: target}
    render(
      <>
        <DragHandle
          handleRef={React.createRef<HTMLDivElement>()}
          dragTargetRef={sharedRef}
          contentWrapperRef={sharedRef}
          aria-label="First pane"
          onDragStart={vi.fn()}
          onDrag={vi.fn()}
          onDragEnd={vi.fn()}
        />
        <DragHandle
          handleRef={React.createRef<HTMLDivElement>()}
          dragTargetRef={sharedRef}
          aria-label="Second pane"
          onDragStart={vi.fn()}
          onDrag={vi.fn()}
          onDragEnd={vi.fn()}
        />
      </>,
    )
    const first = screen.getByRole('slider', {name: 'First pane'})
    const second = screen.getByRole('slider', {name: 'Second pane'})
    fireEvent.keyDown(first, {key: 'ArrowRight'})
    fireEvent.keyDown(second, {key: 'ArrowRight'})
    fireEvent.keyUp(first, {key: 'ArrowRight'})
    expect(target).toHaveAttribute('data-dragging', 'true')

    fireEvent.keyUp(second, {key: 'ArrowRight'})
    expect(target).toHaveAttribute('data-dragging', 'previous')
  })

  it('cleans the original target when its ref changes and the handle unmounts', () => {
    const original = document.createElement('div')
    const replacement = document.createElement('div')
    const targetRef = {current: original}
    const onDragEnd = vi.fn()
    const {unmount} = render(
      <React.StrictMode>
        <DragHandle
          handleRef={React.createRef<HTMLDivElement>()}
          dragTargetRef={targetRef}
          onDragStart={vi.fn()}
          onDrag={vi.fn()}
          onDragEnd={onDragEnd}
        />
      </React.StrictMode>,
    )
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    expect(original).toHaveAttribute('data-dragging', 'true')
    targetRef.current = replacement

    unmount()
    expect(original).not.toHaveAttribute('data-dragging')
    expect(replacement).not.toHaveAttribute('data-dragging')
    expect(onDragEnd).not.toHaveBeenCalled()
  })

  it('ends a keyboard resize when the handle loses focus', () => {
    const pane = document.createElement('div')
    const onBlur = vi.fn()
    const onDragEnd = vi.fn()
    render(
      <>
        <DragHandle
          handleRef={React.createRef<HTMLDivElement>()}
          dragTargetRef={{current: pane}}
          onBlur={onBlur}
          onDragStart={vi.fn()}
          onDrag={vi.fn()}
          onDragEnd={onDragEnd}
        />
        <button type="button">Next</button>
      </>,
    )
    const handle = screen.getByRole('slider')
    act(() => handle.focus())
    fireEvent.keyDown(handle, {key: 'ArrowLeft'})
    act(() => screen.getByRole('button', {name: 'Next'}).focus())
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(handle).not.toHaveAttribute('data-dragging')
    expect(onBlur).toHaveBeenCalledOnce()
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('ignores pointer movement and stale capture events during a keyboard resize', () => {
    const pane = document.createElement('div')
    const onDrag = vi.fn()
    const onDragEnd = vi.fn()
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(123)
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        dragTargetRef={{current: pane}}
        onDragStart={vi.fn()}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />,
    )
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent(handle, pointerEvent('pointermove', {clientX: 100}))
    fireEvent(handle, pointerEvent('lostpointercapture'))

    expect(requestFrame).not.toHaveBeenCalled()
    expect(onDrag).toHaveBeenCalledExactlyOnceWith(3, true)
    expect(onDragEnd).not.toHaveBeenCalled()
    expect(pane).toHaveAttribute('data-dragging', 'true')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('keeps a pointer resize active until its own pointer loses capture', () => {
    const pane = document.createElement('div')
    const onDrag = vi.fn()
    const onDragEnd = vi.fn()
    const callbacks: FrameRequestCallback[] = []
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callbacks.push(callback)
      return 123
    })
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        dragTargetRef={{current: pane}}
        onDragStart={vi.fn()}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()
    fireEvent(handle, pointerEvent('pointerdown'))
    fireEvent(handle, pointerEvent('pointerdown', {pointerId: 2}))
    fireEvent(handle, pointerEvent('pointermove', {clientX: 50, pointerId: 2}))
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    fireEvent(handle, pointerEvent('lostpointercapture', {pointerId: 2}))

    expect(handle.setPointerCapture).toHaveBeenCalledOnce()
    expect(requestFrame).not.toHaveBeenCalled()
    expect(onDrag).not.toHaveBeenCalled()
    expect(onDragEnd).not.toHaveBeenCalled()
    expect(pane).toHaveAttribute('data-dragging', 'true')

    fireEvent(handle, pointerEvent('pointermove', {clientX: 100}))
    expect(requestFrame).toHaveBeenCalledOnce()
    act(() => callbacks[0](0))
    expect(onDrag).toHaveBeenCalledExactlyOnceWith(100, false)
    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('delivers the last queued movement before the active pointer ends', () => {
    const events: string[] = []
    const onDrag = vi.fn((value: number) => events.push(`drag:${value}`))
    const onDragEnd = vi.fn(() => events.push('end'))
    const onPointerUp = vi.fn(() => events.push('pointerup'))
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(123)
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        onDragStart={vi.fn()}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onPointerUp={onPointerUp}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()
    fireEvent(handle, pointerEvent('pointerdown', {clientX: 100}))
    fireEvent(handle, pointerEvent('pointermove', {clientX: 120}))
    fireEvent(handle, pointerEvent('pointermove', {clientX: 145}))
    expect(onDrag).not.toHaveBeenCalled()

    fireEvent(handle, pointerEvent('pointerup', {clientX: 145}))
    expect(cancelFrame).toHaveBeenCalledExactlyOnceWith(123)
    expect(onDrag).toHaveBeenCalledExactlyOnceWith(145, false)
    expect(onPointerUp).toHaveBeenCalledOnce()
    expect(handle).toHaveAttribute('data-dragging')
    expect(onDragEnd).not.toHaveBeenCalled()
    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(events).toEqual(['drag:145', 'pointerup', 'end'])
  })

  it('does not repeat a pointer movement already delivered by the frame', () => {
    const callbacks: FrameRequestCallback[] = []
    const onDrag = vi.fn()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      callbacks.push(callback)
      return 123
    })
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        onDragStart={vi.fn()}
        onDrag={onDrag}
        onDragEnd={vi.fn()}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()
    fireEvent(handle, pointerEvent('pointerdown'))
    fireEvent(handle, pointerEvent('pointermove', {clientX: 120}))
    act(() => callbacks[0](0))
    fireEvent(handle, pointerEvent('pointerup', {clientX: 120}))
    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(onDrag).toHaveBeenCalledExactlyOnceWith(120, false)
    expect(cancelFrame).not.toHaveBeenCalled()
  })

  it('does not flush a queued movement for another pointer or pointer cancellation', () => {
    const onDrag = vi.fn()
    const onDragEnd = vi.fn()
    const onPointerUp = vi.fn()
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(123)
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        onDragStart={vi.fn()}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onPointerUp={onPointerUp}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()
    fireEvent(handle, pointerEvent('pointerdown'))
    fireEvent(handle, pointerEvent('pointermove', {clientX: 120}))
    fireEvent(handle, pointerEvent('pointerup', {pointerId: 2}))
    expect(onPointerUp).toHaveBeenCalledOnce()
    expect(onDrag).not.toHaveBeenCalled()
    expect(cancelFrame).not.toHaveBeenCalled()

    fireEvent(handle, pointerEvent('pointercancel'))
    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(cancelFrame).toHaveBeenCalledExactlyOnceWith(123)
    expect(onDrag).not.toHaveBeenCalled()
    expect(onDragEnd).toHaveBeenCalledOnce()
  })

  it('finishes a keyboard resize before starting a pointer resize', () => {
    const pane = document.createElement('div')
    const onDragStart = vi.fn()
    const onDragEnd = vi.fn()
    render(
      <DragHandle
        handleRef={React.createRef<HTMLDivElement>()}
        dragTargetRef={{current: pane}}
        onDragStart={onDragStart}
        onDrag={vi.fn()}
        onDragEnd={onDragEnd}
      />,
    )
    const handle = screen.getByRole('slider')
    handle.setPointerCapture = vi.fn()
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent(handle, pointerEvent('pointerdown', {clientX: 40}))

    expect(onDragEnd).toHaveBeenCalledOnce()
    expect(onDragStart).toHaveBeenCalledExactlyOnceWith(40)
    expect(pane).toHaveAttribute('data-dragging', 'true')
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(pane).toHaveAttribute('data-dragging', 'true')
    fireEvent(handle, pointerEvent('lostpointercapture'))
    expect(pane).not.toHaveAttribute('data-dragging')
    expect(onDragEnd).toHaveBeenCalledTimes(2)
  })

  it('renders without reading the supplied refs on the server', () => {
    const handleRef = React.createRef<HTMLDivElement>()
    const markup = renderToString(
      <DragHandle
        handleRef={handleRef}
        dragTargetRef={React.createRef<HTMLElement>()}
        contentWrapperRef={React.createRef<HTMLElement>()}
        aria-label="Resize pane"
        onDragStart={() => {}}
        onDrag={() => {}}
        onDragEnd={() => {}}
      />,
    )
    expect(markup).toContain('role="slider"')
    expect(markup).toContain('aria-label="Resize pane"')
    expect(markup).not.toContain('data-dragging')
    expect(markup).not.toContain('dragTargetRef')
    expect(markup).not.toContain('contentWrapperRef')
  })
})
