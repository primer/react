'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {ARROW_KEY_STEP, defaultFormatValueText} from './usePaneWidth'

export interface DragHandleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDoubleClick'> {
  /** Ref to the drag handle element, so the pane can measure and focus it. */
  handleRef: React.RefObject<HTMLDivElement | null>
  /** Called when a pointer starts dragging the handle, with the pointer's horizontal position. */
  onDragStart(clientX: number): void
  /**
   * Called as the handle moves. Pointer positions are batched per frame, with a queued movement delivered on release;
   * an arrow key passes a signed step in pixels and sets `isKeyboard`.
   */
  onDrag(value: number, isKeyboard: boolean): void
  /** Called when a drag ends, or when an arrow key that moved the handle is released. */
  onDragEnd(): void
  /** Called when the handle is double-clicked, conventionally to reset the pane to its default width. */
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>
  /** Element marked with `data-dragging="true"` while the handle is being used. */
  dragTargetRef?: React.RefObject<HTMLElement | null>
  /** Additional element marked with `data-dragging="true"` while the handle is being used. */
  contentWrapperRef?: React.RefObject<HTMLElement | null>
  /** Accessible name for the separator, describing what it resizes. */
  'aria-label'?: string
  /** Id of an element naming the separator, as an alternative to `aria-label`. */
  'aria-labelledby'?: string
  /** Smallest width the separator can be dragged to, announced by assistive technology. */
  'aria-valuemin'?: number
  /** Largest width the separator can be dragged to, announced by assistive technology. */
  'aria-valuemax'?: number
  /** Current width of the pane, announced by assistive technology. */
  'aria-valuenow'?: number
  /**
   * Turns the current width into the text announced while resizing.
   * @default value => `Pane width ${value} pixels`
   */
  formatValueText?: (value: number) => string
}

const activeDragTargets = new WeakMap<HTMLElement, {count: number; previousValue: string | null}>()

function markDragTargets(targets: Array<HTMLElement | null | undefined>) {
  const elements = new Set(targets.filter((target): target is HTMLElement => target != null))
  for (const element of elements) {
    const active = activeDragTargets.get(element)
    if (active) active.count++
    else activeDragTargets.set(element, {count: 1, previousValue: element.getAttribute('data-dragging')})
    element.setAttribute('data-dragging', 'true')
  }
  return () => {
    for (const element of elements) {
      const active = activeDragTargets.get(element)
      if (!active) continue
      active.count--
      if (active.count > 0) continue
      if (active.previousValue === null) element.removeAttribute('data-dragging')
      else element.setAttribute('data-dragging', active.previousValue)
      activeDragTargets.delete(element)
    }
  }
}

export const DragHandle = React.memo(function DragHandle({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuemax': ariaValueMax,
  'aria-valuemin': ariaValueMin,
  'aria-valuenow': ariaValueNow,
  className,
  contentWrapperRef,
  dragTargetRef,
  formatValueText = defaultFormatValueText,
  handleRef,
  onBlur,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onPointerUp,
  ...rest
}: DragHandleProps) {
  const dragKind = React.useRef<'keyboard' | 'pointer' | null>(null)
  const activePointerId = React.useRef<number | null>(null)
  const activeHandle = React.useRef<HTMLDivElement | null>(null)
  const releaseTargets = React.useRef<(() => void) | null>(null)
  const pending = React.useRef<number | null>(null)
  const frame = React.useRef<number | null>(null)
  const start = React.useCallback(
    (handle: HTMLDivElement, kind: 'keyboard' | 'pointer') => {
      if (dragKind.current !== null) return
      dragKind.current = kind
      activeHandle.current = handle
      handle.setAttribute('data-dragging', '')
      releaseTargets.current = markDragTargets([dragTargetRef?.current, contentWrapperRef?.current])
    },
    [contentWrapperRef, dragTargetRef],
  )
  const end = React.useCallback(() => {
    if (dragKind.current === null) return
    dragKind.current = null
    activePointerId.current = null
    releaseTargets.current?.()
    releaseTargets.current = null
    activeHandle.current?.removeAttribute('data-dragging')
    activeHandle.current = null
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    onDragEnd()
  }, [onDragEnd])
  React.useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      releaseTargets.current?.()
      releaseTargets.current = null
      activeHandle.current?.removeAttribute('data-dragging')
      activeHandle.current = null
      dragKind.current = null
      activePointerId.current = null
    },
    [],
  )

  return (
    <div
      {...rest}
      ref={handleRef as React.Ref<HTMLDivElement>}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? 'Draggable pane splitter')}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueNow === undefined ? undefined : formatValueText(ariaValueNow)}
      className={cn(
        "primer:absolute primer:inset-y-0 primer:-inset-x-0.5 primer:cursor-col-resize primer:touch-none primer:select-none primer:focus-visible:outline-2 primer:focus-visible:outline-focus primer:before:absolute primer:before:inset-0 primer:before:rounded-[inherit] primer:before:bg-neutral-muted primer:before:opacity-0 primer:before:transition-opacity primer:before:duration-150 primer:before:content-[''] primer:hover:before:opacity-100 primer:data-[dragging]:before:bg-accent-emphasis primer:data-[dragging]:before:opacity-100 primer:data-[dragging]:before:transition-none",
        className,
      )}
      data-component="PageLayout.DragHandle"
      onBlur={event => {
        if (dragKind.current === 'keyboard') end()
        onBlur?.(event)
      }}
      onDoubleClick={onDoubleClick}
      onPointerDown={event => {
        if (event.button !== 0 || dragKind.current === 'pointer') return
        if (dragKind.current === 'keyboard') end()
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        activePointerId.current = event.pointerId
        start(event.currentTarget, 'pointer')
        onDragStart(event.clientX)
      }}
      onPointerMove={event => {
        if (dragKind.current !== 'pointer' || event.pointerId !== activePointerId.current) return
        pending.current = event.clientX
        if (frame.current === null) {
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            if (pending.current !== null) onDrag(pending.current, false)
          })
        }
      }}
      onPointerUp={event => {
        if (dragKind.current === 'pointer' && event.pointerId === activePointerId.current && frame.current !== null) {
          cancelAnimationFrame(frame.current)
          frame.current = null
          const value = pending.current
          pending.current = null
          if (value !== null) onDrag(value, false)
        }
        onPointerUp?.(event)
      }}
      onLostPointerCapture={event => {
        if (dragKind.current === 'pointer' && event.pointerId === activePointerId.current) end()
      }}
      onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
        event.preventDefault()
        if (dragKind.current === 'pointer') return
        start(event.currentTarget, 'keyboard')
        onDrag(event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -ARROW_KEY_STEP : ARROW_KEY_STEP, true)
      }}
      onKeyUp={event => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          event.preventDefault()
          if (dragKind.current === 'keyboard') end()
        }
      }}
    />
  )
})
