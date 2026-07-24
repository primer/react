'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {ARROW_KEY_STEP, defaultFormatValueText} from './usePaneWidth'

export interface DragHandleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDoubleClick'> {
  handleRef: React.RefObject<HTMLDivElement | null>
  onDragStart(clientX: number): void
  onDrag(value: number, isKeyboard: boolean): void
  onDragEnd(): void
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-valuemin'?: number
  'aria-valuemax'?: number
  'aria-valuenow'?: number
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
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    onDragEnd()
  }, [onDragEnd])
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
        'absolute inset-y-0 -mx-1 w-2 cursor-col-resize touch-none focus-visible:outline-2 focus-visible:outline-focus after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-default hover:after:bg-accent-emphasis',
        className,
      )}
      data-component="PageLayout.DragHandle"
      onDoubleClick={onDoubleClick}
      onPointerDown={event => {
        if (event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        dragging.current = true
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
