'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {ARROW_KEY_STEP, defaultFormatValueText} from './usePaneWidth'

export interface DragHandleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDoubleClick'> {
  /** Ref to the drag handle element, so the pane can measure and focus it. */
  handleRef: React.RefObject<HTMLDivElement | null>
  onDragStart(clientX: number): void
  onDrag(value: number, isKeyboard: boolean): void
  onDragEnd(): void
  /** Called when the handle is double-clicked, conventionally to reset the pane to its default width. */
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>
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
  /** Turns the current width into the text announced while resizing. */
  formatValueText?: (value: number) => string
}

export const DragHandle = React.memo(function DragHandle({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuemax': ariaValueMax,
  'aria-valuemin': ariaValueMin,
  'aria-valuenow': ariaValueNow,
  className,
  formatValueText = defaultFormatValueText,
  handleRef,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragStart,
  ...rest
}: DragHandleProps) {
  const dragging = React.useRef(false)
  const pending = React.useRef<number | null>(null)
  const frame = React.useRef<number | null>(null)
  const end = React.useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    handleRef.current?.removeAttribute('data-dragging')
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    onDragEnd()
  }, [handleRef, onDragEnd])
  React.useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
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
        "absolute inset-y-0 -inset-x-0.5 cursor-col-resize touch-none select-none focus-visible:outline-2 focus-visible:outline-focus before:absolute before:inset-0 before:rounded-[inherit] before:bg-neutral-muted before:opacity-0 before:transition-opacity before:duration-150 before:content-[''] hover:before:opacity-100 data-[dragging]:before:bg-accent-emphasis data-[dragging]:before:opacity-100 data-[dragging]:before:transition-none",
        className,
      )}
      data-component="PageLayout.DragHandle"
      onDoubleClick={onDoubleClick}
      onPointerDown={event => {
        if (event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        dragging.current = true
        event.currentTarget.setAttribute('data-dragging', '')
        onDragStart(event.clientX)
      }}
      onPointerMove={event => {
        if (!dragging.current) return
        pending.current = event.clientX
        if (frame.current === null) {
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            if (pending.current !== null) onDrag(pending.current, false)
          })
        }
      }}
      onLostPointerCapture={end}
      onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
        event.preventDefault()
        dragging.current = true
        event.currentTarget.setAttribute('data-dragging', '')
        onDrag(event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -ARROW_KEY_STEP : ARROW_KEY_STEP, true)
      }}
      onKeyUp={event => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          event.preventDefault()
          end()
        }
      }}
    />
  )
})
