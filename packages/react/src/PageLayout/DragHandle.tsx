import React, {memo} from 'react'
import classes from './PageLayout.module.css'
import {ARROW_KEY_STEP, defaultFormatValueText} from './usePaneWidth'
import {setDraggingStyles, removeDraggingStyles} from './paneUtils'

const isArrowKey = (key: string) =>
  key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown'
const isShrinkKey = (key: string) => key === 'ArrowLeft' || key === 'ArrowDown'

export type DragHandleProps = {
  /** Ref for imperative ARIA updates during drag */
  handleRef: React.RefObject<HTMLDivElement>
  /** Called once when drag starts with initial cursor X position */
  onDragStart: (clientX: number) => void
  /** Called on each drag tick with cursor position (pointer) or delta (keyboard) */
  onDrag: (value: number, isKeyboard: boolean) => void
  /** Called when drag operation completes */
  onDragEnd: () => void
  /** Reset width on double-click */
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>
  /** ARIA slider min value */
  'aria-valuemin'?: number
  /** ARIA slider max value */
  'aria-valuemax'?: number
  /** ARIA slider current value */
  'aria-valuenow'?: number
  /**
   * Ref to the element that receives drag-time styling/containment optimizations
   * (e.g. the resizable pane). When omitted, those side effects are skipped.
   */
  dragTargetRef?: React.RefObject<HTMLElement | null>
  /**
   * Ref to a content wrapper element that receives drag-time containment.
   * Only needed for layouts (like PageLayout) that optimize sibling content during drag.
   */
  contentWrapperRef?: React.RefObject<HTMLElement | null>
  /**
   * Formats the `aria-valuetext` announced for the current width.
   * @default valueNow => `Pane width ${valueNow} pixels`
   */
  formatValueText?: (valueNow: number) => string
  /** Value for the `data-component` attribute. */
  'data-component'?: string
}

/**
 * DragHandle - handles all pointer and keyboard interactions for resizing.
 * ARIA values are set in JSX for SSR accessibility, then updated via DOM
 * manipulation during drag for performance. The consumer owns writing the width
 * (via the `onDrag` callback); this component only reports interactions.
 */
export const DragHandle = memo<DragHandleProps>(function DragHandle({
  handleRef,
  onDragStart,
  onDrag,
  onDragEnd,
  onDoubleClick,
  'aria-valuemin': ariaValueMin,
  'aria-valuemax': ariaValueMax,
  'aria-valuenow': ariaValueNow,
  dragTargetRef,
  contentWrapperRef,
  formatValueText = defaultFormatValueText,
  'data-component': dataComponent = 'PageLayout.DragHandle',
}) {
  const stableOnDragStart = React.useRef(onDragStart)
  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)
  React.useEffect(() => {
    stableOnDragStart.current = onDragStart
    stableOnDrag.current = onDrag
    stableOnDragEnd.current = onDragEnd
  })

  // Dragging state as a ref - cheaper than reading from DOM style
  const isDraggingRef = React.useRef(false)

  // Set inline styles for drag optimizations - zero overhead at rest
  const startDragging = React.useCallback(() => {
    if (isDraggingRef.current) return
    setDraggingStyles({
      handle: handleRef.current,
      pane: dragTargetRef?.current ?? null,
      contentWrapper: contentWrapperRef?.current ?? null,
    })
    isDraggingRef.current = true
  }, [handleRef, contentWrapperRef, dragTargetRef])

  const endDragging = React.useCallback(() => {
    if (!isDraggingRef.current) return
    removeDraggingStyles({
      handle: handleRef.current,
      pane: dragTargetRef?.current ?? null,
      contentWrapper: contentWrapperRef?.current ?? null,
    })
    isDraggingRef.current = false
  }, [handleRef, contentWrapperRef, dragTargetRef])

  /**
   * Pointer down starts a drag operation
   * Capture the pointer to continue receiving events outside the handle area
   */
  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.preventDefault()
      const target = event.currentTarget
      // Try to capture pointer - may fail in test environments or if pointer is already released
      try {
        target.setPointerCapture(event.pointerId)
      } catch {
        // Ignore - pointer capture is a nice-to-have for dragging outside the element
      }
      stableOnDragStart.current(event.clientX)
      startDragging()
    },
    [startDragging],
  )

  // Simple rAF throttle - one update per frame, latest position wins
  const rafIdRef = React.useRef<number | null>(null)
  const pendingClientXRef = React.useRef<number | null>(null)

  /**
   * Pointer move during drag
   * Calls onDrag with absolute cursor X position
   * Uses rAF to coalesce updates to one per frame
   */
  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    event.preventDefault()

    // Store latest position - only the final position before rAF fires matters
    pendingClientXRef.current = event.clientX

    // Schedule update if not already scheduled
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null
        if (pendingClientXRef.current !== null) {
          stableOnDrag.current(pendingClientXRef.current, false)
          pendingClientXRef.current = null
        }
      })
    }
  }, [])

  /**
   * Pointer up - cleanup is handled by onLostPointerCapture event
   * which fires when pointer capture is released (including on pointerup)
   */
  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    event.preventDefault()
  }, [])

  /**
   * Lost pointer capture ends a drag operation
   * Cleans up dragging state and cancels any pending rAF
   * Calls onDragEnd callback
   */
  const handleLostPointerCapture = React.useCallback(() => {
    if (!isDraggingRef.current) return
    // Cancel any pending rAF to prevent stale updates
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      pendingClientXRef.current = null
    }
    endDragging()
    stableOnDragEnd.current()
  }, [endDragging])

  /**
   * Keyboard handling for accessibility
   * Arrow keys adjust the pane size in 3px increments
   * Prevents default scrolling behavior
   * Sets and clears dragging state via data attribute
   * Calls onDrag
   */
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isArrowKey(event.key)) return
      event.preventDefault()

      // https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
      const delta = isShrinkKey(event.key) ? -ARROW_KEY_STEP : ARROW_KEY_STEP

      // Only set dragging on first keydown (not repeats)
      if (!isDraggingRef.current) {
        startDragging()
      }
      stableOnDrag.current(delta, true)
    },
    [startDragging],
  )

  const handleKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isArrowKey(event.key)) return
      event.preventDefault()
      endDragging()
      stableOnDragEnd.current()
    },
    [endDragging],
  )

  // Cleanup rAF on unmount to prevent stale callbacks
  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={handleRef}
      className={classes.DraggableHandle}
      data-component={dataComponent}
      role="slider"
      aria-label="Draggable pane splitter"
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueNow !== undefined ? formatValueText(ariaValueNow) : undefined}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onLostPointerCapture={handleLostPointerCapture}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onDoubleClick={onDoubleClick}
    />
  )
})
