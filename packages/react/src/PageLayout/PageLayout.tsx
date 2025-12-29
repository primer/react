import React, {memo, useRef} from 'react'
import {clsx} from 'clsx'
import {useId} from '../hooks/useId'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import {useSlots} from '../hooks/useSlots'
import {useOverflow} from '../hooks/useOverflow'
import {warning} from '../utils/warning'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'

import classes from './PageLayout.module.css'
import type {FCWithSlotMarker, WithSlotMarker} from '../utils/types'
import {
  usePaneWidth,
  updateAriaValues,
  isCustomWidthOptions,
  isPaneWidth,
  ARROW_KEY_STEP,
  type CustomWidthOptions,
  type PaneWidth,
} from './usePaneWidth'
import {setDraggingStyles, removeDraggingStyles} from './paneUtils'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4,
}

const isArrowKey = (key: string) =>
  key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown'
const isShrinkKey = (key: string) => key === 'ArrowLeft' || key === 'ArrowDown'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SPACING_MAP = {
  none: 0,
  condensed: 3,
  normal: [3, null, null, 4],
}

const PageLayoutContext = React.createContext<{
  padding: keyof typeof SPACING_MAP
  rowGap: keyof typeof SPACING_MAP
  columnGap: keyof typeof SPACING_MAP
  paneRef: React.RefObject<HTMLDivElement>
  contentRef: React.RefObject<HTMLDivElement>
}>({
  padding: 'normal',
  rowGap: 'normal',
  columnGap: 'normal',
  paneRef: {current: null},
  contentRef: {current: null},
})

// ----------------------------------------------------------------------------
// PageLayout

export type PageLayoutProps = {
  /** The maximum width of the page container */
  containerWidth?: keyof typeof containerWidths
  /** The spacing between the outer edges of the page container and the viewport */
  padding?: keyof typeof SPACING_MAP
  rowGap?: keyof typeof SPACING_MAP
  columnGap?: keyof typeof SPACING_MAP

  /** Private prop to allow SplitPageLayout to customize slot components */
  _slotsConfig?: Record<'header' | 'footer', React.ElementType>
  className?: string
  style?: React.CSSProperties
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const containerWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px',
}

// TODO: refs
const Root: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  containerWidth = 'xlarge',
  padding = 'normal',
  rowGap = 'normal',
  columnGap = 'normal',
  children,
  className,
  style,
  _slotsConfig: slotsConfig,
}) => {
  const paneRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [slots, rest] = useSlots(children, slotsConfig ?? {header: Header, footer: Footer})

  const memoizedContextValue = React.useMemo(() => {
    return {
      padding,
      rowGap,
      columnGap,
      paneRef,
      contentRef,
    }
  }, [padding, rowGap, columnGap, paneRef, contentRef])

  return (
    <PageLayoutContext.Provider value={memoizedContextValue}>
      <RootWrapper style={style} padding={padding} className={className}>
        <div className={classes.PageLayoutWrapper} data-width={containerWidth}>
          {slots.header}
          <div ref={contentRef} className={clsx(classes.PageLayoutContent)}>
            {rest}
          </div>
          {slots.footer}
        </div>
      </RootWrapper>
    </PageLayoutContext.Provider>
  )
}

const RootWrapper = memo(
  ({
    style,
    padding,
    children,
    className,
  }: React.PropsWithChildren<Pick<PageLayoutProps, 'style' | 'padding' | 'className'>>) => {
    return (
      <div
        style={
          {
            '--spacing': `var(--spacing-${padding})`,
            ...style,
          } as React.CSSProperties
        }
        className={clsx(classes.PageLayoutRoot, className)}
      >
        {children}
      </div>
    )
  },
)

Root.displayName = 'PageLayout'

// ----------------------------------------------------------------------------
// Divider (internal)

type DividerProps = {
  variant?: 'none' | 'line' | 'filled' | ResponsiveValue<'none' | 'line' | 'filled'>
  className?: string
  style?: React.CSSProperties
  position?: keyof typeof panePositions | ResponsiveValue<keyof typeof panePositions>
}

const HorizontalDivider = memo<React.PropsWithChildren<DividerProps>>(
  ({variant = 'none', className, position, style}) => {
    const {padding} = React.useContext(PageLayoutContext)

    return (
      <div
        className={clsx(classes.HorizontalDivider, className)}
        {...getResponsiveAttributes('variant', variant)}
        {...getResponsiveAttributes('position', position)}
        style={
          {
            '--spacing-divider': `var(--spacing-${padding})`,
            ...style,
          } as React.CSSProperties
        }
      />
    )
  },
)

HorizontalDivider.displayName = 'HorizontalDivider'

type VerticalDividerProps = DividerProps & {
  draggable?: boolean
}

const VerticalDivider = memo<React.PropsWithChildren<VerticalDividerProps>>(
  ({variant = 'none', position, className, style, children}) => {
    return (
      <div
        className={clsx(classes.VerticalDivider, className)}
        {...getResponsiveAttributes('variant', variant)}
        {...getResponsiveAttributes('position', position)}
        style={style}
      >
        {children}
      </div>
    )
  },
)

VerticalDivider.displayName = 'VerticalDivider'

type DragHandleProps = {
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
}

/**
 * DragHandle - handles all pointer and keyboard interactions for resizing
 * ARIA values are set in JSX for SSR accessibility,
 * then updated via DOM manipulation during drag for performance
 */
const DragHandle = memo<DragHandleProps>(function DragHandle({
  handleRef,
  onDragStart,
  onDrag,
  onDragEnd,
  onDoubleClick,
  'aria-valuemin': ariaValueMin,
  'aria-valuemax': ariaValueMax,
  'aria-valuenow': ariaValueNow,
}) {
  const stableOnDragStart = React.useRef(onDragStart)
  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)
  React.useEffect(() => {
    stableOnDragStart.current = onDragStart
    stableOnDrag.current = onDrag
    stableOnDragEnd.current = onDragEnd
  })

  const {paneRef, contentRef} = React.useContext(PageLayoutContext)

  // Dragging state as a ref - cheaper than reading from DOM style
  const isDraggingRef = React.useRef(false)

  // Set inline styles for drag optimizations - zero overhead at rest
  const startDragging = React.useCallback(() => {
    if (isDraggingRef.current) return
    setDraggingStyles({
      handle: handleRef.current,
      pane: paneRef.current,
      content: contentRef.current,
    })
    isDraggingRef.current = true
  }, [handleRef, contentRef, paneRef])

  const endDragging = React.useCallback(() => {
    if (!isDraggingRef.current) return
    removeDraggingStyles({
      handle: handleRef.current,
      pane: paneRef.current,
      content: contentRef.current,
    })
    isDraggingRef.current = false
  }, [handleRef, contentRef, paneRef])

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
      role="slider"
      aria-label="Draggable pane splitter"
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueNow !== undefined ? `Pane width ${ariaValueNow} pixels` : undefined}
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

// ----------------------------------------------------------------------------
// PageLayout.Header

export type PageLayoutHeaderProps = {
  /**
   * A unique label for the rendered banner landmark
   */
  'aria-label'?: React.AriaAttributes['aria-label']

  /**
   * An id to an element which uniquely labels the rendered banner landmark
   */
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']

  padding?: keyof typeof SPACING_MAP
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line', 'none' | 'line' | 'filled'>
  /**
   * @deprecated Use the `divider` prop with a responsive value instead.
   *
   * Before:
   * ```
   * divider="line"
   * dividerWhenNarrow="filled"
   * ```
   *
   * After:
   * ```
   * divider={{regular: 'line', narrow: 'filled'}}
   * ```
   */
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
  hidden?: boolean | ResponsiveValue<boolean>
  className?: string
  style?: React.CSSProperties
}

const Header: FCWithSlotMarker<React.PropsWithChildren<PageLayoutHeaderProps>> = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  style,
  className,
}) => {
  // Combine divider and dividerWhenNarrow for backwards compatibility
  const dividerProp =
    !isResponsiveValue(divider) && dividerWhenNarrow !== 'inherit'
      ? {regular: divider, narrow: dividerWhenNarrow}
      : divider

  const {rowGap} = React.useContext(PageLayoutContext)

  return (
    <header
      aria-label={label}
      aria-labelledby={labelledBy}
      {...getResponsiveAttributes('hidden', hidden)}
      className={clsx(classes.Header, className)}
      style={
        {
          '--spacing': `var(--spacing-${rowGap})`,
          ...style,
        } as React.CSSProperties
      }
    >
      <div
        className={classes.HeaderContent}
        style={
          {
            '--spacing': `var(--spacing-${padding})`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
      <HorizontalDivider
        variant={dividerProp}
        className={classes.HeaderHorizontalDivider}
        style={
          {
            '--spacing': `var(--spacing-${rowGap})`,
          } as React.CSSProperties
        }
      />
    </header>
  )
}
Header.displayName = 'PageLayout.Header'

// ----------------------------------------------------------------------------
// PageLayout.Content

export type PageLayoutContentProps = {
  /**
   * Provide an optional element type for the outermost element rendered by the component.
   * @default 'main'
   */
  as?: React.ElementType

  /**
   * A unique label for the rendered main landmark
   */
  'aria-label'?: React.AriaAttributes['aria-label']

  /**
   * An id to an element which uniquely labels the rendered main landmark
   */
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  width?: keyof typeof contentWidths
  padding?: keyof typeof SPACING_MAP
  hidden?: boolean | ResponsiveValue<boolean>
  className?: string
  style?: React.CSSProperties
}

// TODO: Account for pane width when centering content
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const contentWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px',
}

const Content: FCWithSlotMarker<React.PropsWithChildren<PageLayoutContentProps>> = ({
  as = 'main',
  'aria-label': label,
  'aria-labelledby': labelledBy,
  width = 'full',
  padding = 'none',
  hidden = false,
  children,
  className,
  style,
}) => {
  const Component = as

  return (
    <Component
      aria-label={label}
      aria-labelledby={labelledBy}
      style={style}
      className={clsx(classes.ContentWrapper, className)}
      {...getResponsiveAttributes('is-hidden', hidden)}
    >
      <div
        className={classes.Content}
        data-width={width}
        style={
          {
            '--spacing': `var(--spacing-${padding})`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </Component>
  )
}
Content.displayName = 'PageLayout.Content'

// ----------------------------------------------------------------------------
// PageLayout.Pane

export type PageLayoutPaneProps = {
  position?: keyof typeof panePositions | ResponsiveValue<keyof typeof panePositions>
  /**
   * @deprecated Use the `position` prop with a responsive value instead.
   *
   * Before:
   * ```
   * position="start"
   * positionWhenNarrow="end"
   * ```
   *
   * After:
   * ```
   * position={{regular: 'start', narrow: 'end'}}
   * ```
   */
  positionWhenNarrow?: 'inherit' | keyof typeof panePositions
  'aria-labelledby'?: string
  'aria-label'?: string
  width?: PaneWidth | CustomWidthOptions
  minWidth?: number
  resizable?: boolean
  widthStorageKey?: string
  padding?: keyof typeof SPACING_MAP
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line', 'none' | 'line' | 'filled'>
  /**
   * @deprecated Use the `divider` prop with a responsive value instead.
   *
   * Before:
   * ```
   * divider="line"
   * dividerWhenNarrow="filled"
   * ```
   *
   * After:
   * ```
   * divider={{regular: 'line', narrow: 'filled'}}
   * ```
   */
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
  sticky?: boolean
  offsetHeader?: string | number
  hidden?: boolean | ResponsiveValue<boolean>
  id?: string
  className?: string
  style?: React.CSSProperties
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const panePositions = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd,
}

const overflowProps = {tabIndex: 0, role: 'region'}

const Pane = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PageLayoutPaneProps>>(
  (
    {
      'aria-label': label,
      'aria-labelledby': labelledBy,
      position: responsivePosition = 'end',
      positionWhenNarrow = 'inherit',
      width = 'medium',
      minWidth = 256,
      padding = 'none',
      resizable = false,
      widthStorageKey = 'paneWidth',
      divider: responsiveDivider = 'none',
      dividerWhenNarrow = 'inherit',
      sticky = false,
      offsetHeader = 0,
      hidden: responsiveHidden = false,
      children,
      id,
      className,
      style,
    },
    forwardRef,
  ) => {
    // Combine position and positionWhenNarrow for backwards compatibility
    const positionProp =
      !isResponsiveValue(responsivePosition) && positionWhenNarrow !== 'inherit'
        ? {regular: responsivePosition, narrow: positionWhenNarrow}
        : responsivePosition

    // Combine divider and dividerWhenNarrow for backwards compatibility
    const dividerProp =
      !isResponsiveValue(responsiveDivider) && dividerWhenNarrow !== 'inherit'
        ? {regular: responsiveDivider, narrow: dividerWhenNarrow}
        : responsiveDivider

    // For components that need responsive values in JavaScript logic, we'll use a fallback value
    // The actual responsive behavior will be handled by CSS through data attributes
    const position = isResponsiveValue(positionProp) ? 'end' : positionProp
    const dividerVariant = isResponsiveValue(dividerProp) ? 'none' : dividerProp

    const {rowGap, columnGap, paneRef, contentRef} = React.useContext(PageLayoutContext)

    // Ref to the drag handle for updating ARIA attributes
    const handleRef = React.useRef<HTMLDivElement>(null)

    // Cache drag start values to calculate relative delta during drag
    // This approach is immune to layout shifts (scrollbars appearing/disappearing)
    const dragStartClientXRef = React.useRef<number>(0)
    const dragStartWidthRef = React.useRef<number>(0)
    // Cache max width at drag start - won't change during a drag operation
    const dragMaxWidthRef = React.useRef<number>(0)

    const {currentWidth, currentWidthRef, minPaneWidth, maxPaneWidth, getMaxPaneWidth, saveWidth, getDefaultWidth} =
      usePaneWidth({
        width,
        minWidth,
        resizable,
        widthStorageKey,
        paneRef,
        handleRef,
        contentRef,
      })

    useRefObjectAsForwardedRef(forwardRef, paneRef)

    const hasOverflow = useOverflow(paneRef)

    const paneId = useId(id)

    const labelProp: {'aria-labelledby'?: string; 'aria-label'?: string} = {}
    if (hasOverflow) {
      warning(
        label === undefined && labelledBy === undefined,
        'The <PageLayout.Pane> has overflow and `aria-label` or `aria-labelledby` has not been set. ' +
          'Please provide `aria-label` or `aria-labelledby` to <PageLayout.Pane> in order to label this ' +
          'region.',
      )

      if (labelledBy) {
        labelProp['aria-labelledby'] = labelledBy
      } else if (label) {
        labelProp['aria-label'] = label
      }
    }

    return (
      <div
        className={clsx(classes.PaneWrapper, className)}
        style={
          {
            '--offset-header': typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
            '--spacing-row': `var(--spacing-${rowGap})`,
            '--spacing-column': `var(--spacing-${columnGap})`,
            ...style,
          } as React.CSSProperties
        }
        {...getResponsiveAttributes('is-hidden', responsiveHidden)}
        {...getResponsiveAttributes('position', positionProp)}
        data-sticky={sticky || undefined}
      >
        {/* Show a horizontal divider when viewport is narrow. Otherwise, show a vertical divider. */}
        <HorizontalDivider
          variant={isResponsiveValue(dividerProp) ? dividerProp : {narrow: dividerVariant, regular: 'none'}}
          className={classes.PaneHorizontalDivider}
          style={
            {
              '--spacing': `var(--spacing-${rowGap})`,
            } as React.CSSProperties
          }
          position={positionProp}
        />
        <div
          ref={paneRef}
          // suppressHydrationWarning: We intentionally read from localStorage during
          // useState init to avoid resize flicker, which causes a hydration mismatch
          // for --pane-width. This only affects this element, not children.
          suppressHydrationWarning
          {...(hasOverflow ? overflowProps : {})}
          {...labelProp}
          {...(id && {id: paneId})}
          className={classes.Pane}
          data-resizable={resizable || undefined}
          style={
            {
              '--spacing': `var(--spacing-${padding})`,
              '--pane-min-width': isCustomWidthOptions(width) ? width.min : `${minWidth}px`,
              '--pane-max-width': isCustomWidthOptions(width) ? width.max : `calc(100vw - var(--pane-max-width-diff))`,
              '--pane-width-custom': isCustomWidthOptions(width) ? width.default : undefined,
              '--pane-width-size': `var(--pane-width-${isPaneWidth(width) ? width : 'custom'})`,
              '--pane-width': `${currentWidth}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
        <VerticalDivider
          variant={
            isResponsiveValue(dividerProp)
              ? {
                  narrow: 'none',
                  regular: resizable ? 'line' : dividerProp.regular || 'none',
                  wide: resizable ? 'line' : dividerProp.wide || dividerProp.regular || 'none',
                }
              : {
                  narrow: 'none',
                  // If pane is resizable, always show a vertical divider on regular viewports
                  regular: resizable ? 'line' : dividerVariant,
                }
          }
          // If pane is resizable, the divider should be draggable
          draggable={resizable}
          position={positionProp}
          className={classes.PaneVerticalDivider}
          style={
            {
              '--spacing': `var(--spacing-${columnGap})`,
            } as React.CSSProperties
          }
        >
          {resizable ? (
            <DragHandle
              handleRef={handleRef}
              aria-valuemin={minPaneWidth}
              aria-valuemax={maxPaneWidth}
              aria-valuenow={currentWidth}
              onDragStart={clientX => {
                // Cache cursor position and pane width at drag start
                // Using relative delta (current - start) is immune to layout shifts
                // (e.g., scrollbars appearing/disappearing during drag)
                dragStartClientXRef.current = clientX
                dragStartWidthRef.current = paneRef.current?.getBoundingClientRect().width ?? currentWidthRef.current!
                // Cache max width - won't change during drag
                dragMaxWidthRef.current = getMaxPaneWidth()
              }}
              onDrag={(value, isKeyboard) => {
                // Use cached max width for pointer drag, fresh value for keyboard (less frequent)
                const maxWidth = isKeyboard ? getMaxPaneWidth() : dragMaxWidthRef.current

                if (isKeyboard) {
                  // Keyboard: value is a delta (e.g., +3 or -3)
                  const delta = value
                  const newWidth = Math.max(minPaneWidth, Math.min(maxWidth, currentWidthRef.current! + delta))
                  if (newWidth !== currentWidthRef.current) {
                    currentWidthRef.current = newWidth
                    paneRef.current?.style.setProperty('--pane-width', `${newWidth}px`)
                    updateAriaValues(handleRef.current, {current: newWidth, max: maxWidth})
                  }
                } else {
                  // Pointer: value is clientX - calculate width using relative delta from drag start
                  // This approach is immune to layout shifts during drag
                  if (paneRef.current) {
                    const deltaX = value - dragStartClientXRef.current
                    // For position='end': cursor moving left (negative delta) increases width
                    // For position='start': cursor moving right (positive delta) increases width
                    const directedDelta = position === 'end' ? -deltaX : deltaX
                    const newWidth = dragStartWidthRef.current + directedDelta

                    const clampedWidth = Math.max(minPaneWidth, Math.min(maxWidth, newWidth))

                    // Only update if width actually changed
                    if (Math.round(clampedWidth) !== Math.round(currentWidthRef.current!)) {
                      paneRef.current.style.setProperty('--pane-width', `${clampedWidth}px`)
                      currentWidthRef.current = clampedWidth
                      updateAriaValues(handleRef.current, {current: Math.round(clampedWidth), max: maxWidth})
                    }
                  }
                }
              }}
              onDragEnd={() => {
                // Sync React state so parent re-renders use the correct width
                saveWidth(currentWidthRef.current!)
              }}
              onDoubleClick={() => {
                const resetWidth = getDefaultWidth()
                if (paneRef.current) {
                  paneRef.current.style.setProperty('--pane-width', `${resetWidth}px`)
                  currentWidthRef.current = resetWidth
                  updateAriaValues(handleRef.current, {current: resetWidth})
                }
                saveWidth(resetWidth)
              }}
            />
          ) : null}
        </VerticalDivider>
      </div>
    )
  },
)

Pane.displayName = 'PageLayout.Pane'

// ----------------------------------------------------------------------------
// PageLayout.Footer

export type PageLayoutFooterProps = {
  /**
   * A unique label for the rendered contentinfo landmark
   */
  'aria-label'?: React.AriaAttributes['aria-label']

  /**
   * An id to an element which uniquely labels the rendered contentinfo landmark
   */
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  padding?: keyof typeof SPACING_MAP
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line', 'none' | 'line' | 'filled'>
  /**
   * @deprecated Use the `divider` prop with a responsive value instead.
   *
   * Before:
   * ```
   * divider="line"
   * dividerWhenNarrow="filled"
   * ```
   *
   * After:
   * ```
   * divider={{regular: 'line', narrow: 'filled'}}
   * ```
   */
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
  hidden?: boolean | ResponsiveValue<boolean>
  className?: string
  style?: React.CSSProperties
}

const Footer: FCWithSlotMarker<React.PropsWithChildren<PageLayoutFooterProps>> = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  className,
  style,
}) => {
  // Combine divider and dividerWhenNarrow for backwards compatibility
  const dividerProp =
    !isResponsiveValue(divider) && dividerWhenNarrow !== 'inherit'
      ? {regular: divider, narrow: dividerWhenNarrow}
      : divider

  const {rowGap} = React.useContext(PageLayoutContext)

  return (
    <footer
      aria-label={label}
      aria-labelledby={labelledBy}
      {...getResponsiveAttributes('hidden', hidden)}
      className={clsx(classes.FooterWrapper, className)}
      style={
        {
          '--spacing': `var(--spacing-${rowGap})`,
          ...style,
        } as React.CSSProperties
      }
    >
      <HorizontalDivider
        className={classes.FooterHorizontalDivider}
        style={
          {
            '--spacing': `var(--spacing-${rowGap})`,
          } as React.CSSProperties
        }
        variant={dividerProp}
      />
      <div
        className={classes.FooterContent}
        style={
          {
            '--spacing': `var(--spacing-${padding})`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </footer>
  )
}
Footer.displayName = 'PageLayout.Footer'

// ----------------------------------------------------------------------------
// Export

export const PageLayout = Object.assign(Root, {
  __SLOT__: Symbol('PageLayout'),
  Header,
  Content,
  Pane: Pane as WithSlotMarker<typeof Pane>,
  Footer,
})

Header.__SLOT__ = Symbol('PageLayout.Header')
Content.__SLOT__ = Symbol('PageLayout.Content')
;(Pane as WithSlotMarker<typeof Pane>).__SLOT__ = Symbol('PageLayout.Pane')
Footer.__SLOT__ = Symbol('PageLayout.Footer')
