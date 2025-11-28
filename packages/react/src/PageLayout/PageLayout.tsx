import React, {useRef} from 'react'
import {clsx} from 'clsx'
import {useId} from '../hooks/useId'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import {useSlots} from '../hooks/useSlots'
import {canUseDOM} from '../utils/environment'
import {useOverflow} from '../hooks/useOverflow'
import {warning} from '../utils/warning'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'

import classes from './PageLayout.module.css'
import type {FCWithSlotMarker, WithSlotMarker} from '../utils/types'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4,
}

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
}>({
  padding: 'normal',
  rowGap: 'normal',
  columnGap: 'normal',
  paneRef: {current: null},
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

  const [slots, rest] = useSlots(children, slotsConfig ?? {header: Header, footer: Footer})

  const memoizedContextValue = React.useMemo(() => {
    return {
      padding,
      rowGap,
      columnGap,
      paneRef,
    }
  }, [padding, rowGap, columnGap, paneRef])

  return (
    <PageLayoutContext.Provider value={memoizedContextValue}>
      <div
        style={
          {
            '--spacing': `var(--spacing-${padding})`,
            ...style,
          } as React.CSSProperties
        }
        className={clsx(classes.PageLayoutRoot, className)}
      >
        <div className={classes.PageLayoutWrapper} data-width={containerWidth}>
          {slots.header}
          <div className={clsx(classes.PageLayoutContent)}>{rest}</div>
          {slots.footer}
        </div>
      </div>
    </PageLayoutContext.Provider>
  )
}

Root.displayName = 'PageLayout'

// ----------------------------------------------------------------------------
// Divider (internal)

type DividerProps = {
  variant?: 'none' | 'line' | 'filled' | ResponsiveValue<'none' | 'line' | 'filled'>
  className?: string
  style?: React.CSSProperties
  position?: keyof typeof panePositions | ResponsiveValue<keyof typeof panePositions>
}

const HorizontalDivider: React.FC<React.PropsWithChildren<DividerProps>> = ({
  variant = 'none',
  className,
  position,
  style,
}) => {
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
}

type DraggableDividerProps = {
  draggable?: boolean
  onDragStart?: () => void
  onDrag?: (delta: number, isKeyboard: boolean) => void
  onDragEnd?: () => void
  onDoubleClick?: () => void
}

function getConstraints(element: HTMLElement) {
  const paneStyles = getComputedStyle(element)
  const maxPaneWidthDiff = Number(paneStyles.getPropertyValue('--pane-max-width-diff').split('px')[0]) || 511
  const minPaneWidth = Number(paneStyles.getPropertyValue('--pane-min-width').split('px')[0]) || 256
  const viewportWidth = window.innerWidth
  const maxPaneWidth = viewportWidth > maxPaneWidthDiff ? viewportWidth - maxPaneWidthDiff : viewportWidth

  return {minWidth: minPaneWidth, maxWidth: maxPaneWidth}
}

const VerticalDivider: React.FC<React.PropsWithChildren<DividerProps & DraggableDividerProps>> = ({
  variant = 'none',
  draggable = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onDoubleClick,
  position,
  className,
  style,
}) => {
  const isDraggingRef = React.useRef(false)

  const stableOnDragStart = React.useRef(onDragStart)
  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)
  React.useEffect(() => {
    stableOnDrag.current = onDrag
    stableOnDragEnd.current = onDragEnd
    stableOnDragStart.current = onDragStart
  })

  const {paneRef} = React.useContext(PageLayoutContext)

  // Cache ContentWrapper reference to avoid repeated DOM queries
  const contentWrapperRef = React.useRef<HTMLElement | null>(null)

  React.useLayoutEffect(() => {
    contentWrapperRef.current = document.querySelector('.ContentWrapper')
  }, [])

  const [minWidth, setMinWidth] = React.useState(0)
  const [maxWidth, setMaxWidth] = React.useState(0)
  const [currentWidth, setCurrentWidth] = React.useState(0)

  // Initialize dimensions once
  React.useEffect(() => {
    if (paneRef.current !== null) {
      const constraints = getConstraints(paneRef.current)
      const paneWidth = paneRef.current.getBoundingClientRect().width
      setMinWidth(constraints.minWidth)
      setMaxWidth(constraints.maxWidth)
      setCurrentWidth(paneWidth)
    }
  }, [paneRef])

  // Track start position to avoid cursor drift
  const dragStartXRef = React.useRef(0)
  const lastAppliedXRef = React.useRef(0)

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.preventDefault()
      const target = event.currentTarget
      target.setPointerCapture(event.pointerId)
      isDraggingRef.current = true
      target.setAttribute('data-dragging', 'true')

      // Track start position
      dragStartXRef.current = event.clientX
      lastAppliedXRef.current = event.clientX

      if (paneRef.current) {
        // Essential JS optimizations that can't be done in CSS
        const currentHeight = paneRef.current.scrollHeight
        paneRef.current.style.containIntrinsicSize = `auto ${currentHeight}px`

        // Lock scroll position to prevent reflow triggers
        const scrollTop = paneRef.current.scrollTop
        paneRef.current.style.overflow = 'hidden'
        paneRef.current.scrollTop = scrollTop

        // Optimize ContentWrapper
        const contentWrapper = contentWrapperRef.current
        if (contentWrapper) {
          const contentScrollTop = contentWrapper.scrollTop || 0
          contentWrapper.style.overflow = 'hidden'
          contentWrapper.scrollTop = contentScrollTop
        }
      }

      stableOnDragStart.current?.()
    },
    [paneRef],
  )

  const pointerMoveThrottleRafIdRef = React.useRef<number | null>(null)

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    event.preventDefault()

    // Calculate total delta from start position
    const totalDelta = event.clientX - dragStartXRef.current

    // Snap to 4px grid
    const quantized = Math.round(totalDelta / 4) * 4

    // Only update if quantized position changed
    const lastQuantized = Math.round((lastAppliedXRef.current - dragStartXRef.current) / 4) * 4
    if (quantized !== lastQuantized) {
      const delta = quantized - lastQuantized
      lastAppliedXRef.current = dragStartXRef.current + quantized

      // Throttle to every other frame for huge DOM
      if (!pointerMoveThrottleRafIdRef.current) {
        pointerMoveThrottleRafIdRef.current = requestAnimationFrame(() => {
          stableOnDrag.current?.(delta, false)
          pointerMoveThrottleRafIdRef.current = null
        })
      }
    }
  }, [])

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    event.preventDefault()
    // Cleanup will happen in onLostPointerCapture
  }, [])

  const handleLostPointerCapture = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const target = event.currentTarget
      target.removeAttribute('data-dragging')

      // Cancel any pending throttle frame
      if (pointerMoveThrottleRafIdRef.current) {
        cancelAnimationFrame(pointerMoveThrottleRafIdRef.current)
        pointerMoveThrottleRafIdRef.current = null
      }

      if (paneRef.current) {
        // Restore scroll (CSS handles most other cleanup)
        paneRef.current.style.overflow = ''
        paneRef.current.style.containIntrinsicSize = ''

        // Re-measure content after drag
        requestAnimationFrame(() => {
          if (paneRef.current) {
            const newHeight = paneRef.current.scrollHeight
            paneRef.current.style.containIntrinsicSize = `auto ${newHeight}px`
          }
        })

        // Restore ContentWrapper scroll
        const contentWrapper = contentWrapperRef.current
        if (contentWrapper) {
          contentWrapper.style.overflow = ''
        }
      }

      stableOnDragEnd.current?.()
    },
    [paneRef],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        // Don't set data-dragging for keyboard - prevents CSS flicker
        setCurrentWidth(prevWidth => {
          let delta = 0
          // https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
          if ((event.key === 'ArrowLeft' || event.key === 'ArrowDown') && prevWidth > minWidth) {
            delta = -3
          } else if ((event.key === 'ArrowRight' || event.key === 'ArrowUp') && prevWidth < maxWidth) {
            delta = 3
          }

          if (delta !== 0) {
            stableOnDrag.current?.(delta, true)
          }

          return prevWidth + delta
        })
      }
    },
    [minWidth, maxWidth],
  )

  const handleKeyUp = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      event.preventDefault()
      stableOnDragEnd.current?.()
    }
  }, [])

  return (
    <div
      className={clsx(classes.VerticalDivider, className)}
      {...getResponsiveAttributes('variant', variant)}
      {...getResponsiveAttributes('position', position)}
      style={style}
    >
      {draggable ? (
        <div
          className={classes.DraggableHandle}
          role="slider"
          aria-label="Draggable pane splitter"
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          aria-valuenow={currentWidth}
          aria-valuetext={`Pane width ${currentWidth} pixels`}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onLostPointerCapture={handleLostPointerCapture}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onDoubleClick={onDoubleClick}
        />
      ) : null}
    </div>
  )
}

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

type Measurement = `${number}px`

type CustomWidthOptions = {
  min: Measurement
  default: Measurement
  max: Measurement
}

type PaneWidth = keyof typeof paneWidths

const isCustomWidthOptions = (width: PaneWidth | CustomWidthOptions): width is CustomWidthOptions => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (width as CustomWidthOptions).default !== undefined
}

const isPaneWidth = (width: PaneWidth | CustomWidthOptions): width is PaneWidth => {
  return ['small', 'medium', 'large'].includes(width as PaneWidth)
}

export type PageLayoutPaneProps = {
  position?: keyof typeof panePositions | ResponsiveValue<keyof typeof panePositions>
  /**
   * @deprecated Use the `position` prop with a responsive value instead.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paneWidths = {
  small: ['100%', null, '240px', '256px'],
  medium: ['100%', null, '256px', '296px'],
  large: ['100%', null, '256px', '320px'],
}

const defaultPaneWidth = {small: 256, medium: 296, large: 320}

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

    const {rowGap, columnGap, paneRef} = React.useContext(PageLayoutContext)

    const getDefaultPaneWidth = (width: PaneWidth | CustomWidthOptions): number => {
      if (isPaneWidth(width)) {
        return defaultPaneWidth[width]
      } else if (isCustomWidthOptions(width)) {
        return Number(width.default.split('px')[0])
      }
      return 0
    }

    const [paneWidth, setPaneWidth] = React.useState(() => {
      if (!canUseDOM) {
        return getDefaultPaneWidth(width)
      }

      let storedWidth

      try {
        storedWidth = localStorage.getItem(widthStorageKey)
      } catch (_error) {
        storedWidth = null
      }

      return storedWidth && !isNaN(Number(storedWidth)) ? Number(storedWidth) : getDefaultPaneWidth(width)
    })

    // Track accumulated drag delta during pointer drag
    const accumulatedDragDeltaRef = React.useRef(0)

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

    const animationFrameRef = React.useRef<number | null>(null)
    const lastFrameTimeRef = React.useRef(0)
    const TARGET_FPS_DURING_DRAG = 30
    const FRAME_BUDGET = 1000 / TARGET_FPS_DURING_DRAG

    const applyWidthUpdate = React.useCallback(() => {
      if (paneRef.current) {
        const {minWidth: minPaneWidth, maxWidth: maxPaneWidth} = getConstraints(paneRef.current)
        const newWidth = paneWidth + accumulatedDragDeltaRef.current
        const clampedWidth = Math.max(minPaneWidth, Math.min(maxPaneWidth, newWidth))
        paneRef.current.style.setProperty('--pane-width', `${clampedWidth}px`)
      }
      animationFrameRef.current = null
    }, [paneRef, paneWidth])

    React.useEffect(() => {
      const pane = paneRef.current
      if (!pane) return

      // Initial measurement
      const height = pane.scrollHeight
      pane.style.contentVisibility = 'auto'
      pane.style.containIntrinsicSize = `auto ${height}px`

      // Update when content changes (but not during drag)
      const updateSize = () => {
        // Only update if not currently dragging
        const isDragging = document.querySelector('.DraggableHandle[data-dragging="true"]')
        if (!isDragging) {
          const newHeight = pane.scrollHeight
          pane.style.containIntrinsicSize = `auto ${newHeight}px`
        }
      }

      // Use ResizeObserver to detect content changes
      const resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(pane)

      return () => {
        resizeObserver.disconnect()
        pane.style.contentVisibility = ''
        pane.style.containIntrinsicSize = ''
      }
    }, [paneRef])

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
              '--pane-width': `${paneWidth}px`,
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
          onDrag={(delta, isKeyboard = false) => {
            const deltaWithDirection = isKeyboard ? delta : position === 'end' ? -delta : delta

            if (isKeyboard) {
              setPaneWidth(prev => prev + deltaWithDirection)
            } else {
              // Accumulate deltas
              accumulatedDragDeltaRef.current += deltaWithDirection

              if (!animationFrameRef.current) {
                animationFrameRef.current = requestAnimationFrame(timestamp => {
                  // Cap at 30fps for smoother experience with huge DOM
                  if (timestamp - lastFrameTimeRef.current < FRAME_BUDGET) {
                    // Skip this frame, reschedule
                    animationFrameRef.current = requestAnimationFrame(ts => {
                      lastFrameTimeRef.current = ts
                      applyWidthUpdate()
                    })
                    return
                  }

                  lastFrameTimeRef.current = timestamp
                  applyWidthUpdate()
                })
              }
            }
          }}
          onDragEnd={() => {
            // Clear any pending animation frame
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current)
              animationFrameRef.current = null
            }

            // Commit accumulated pointer drag delta to React state
            const totalDelta = accumulatedDragDeltaRef.current
            if (totalDelta !== 0 && paneRef.current) {
              // Read the actual applied width from DOM to handle clamping
              const actualWidth = parseInt(paneRef.current.style.getPropertyValue('--pane-width')) || paneWidth

              setPaneWidth(actualWidth) // Use actual width, not paneWidth + totalDelta

              try {
                localStorage.setItem(widthStorageKey, actualWidth.toString())
              } catch (_error) {
                // Ignore errors
              }
              accumulatedDragDeltaRef.current = 0
            }
          }}
          position={positionProp}
          // Reset pane width on double click
          onDoubleClick={() => {
            accumulatedDragDeltaRef.current = 0
            const defaultWidth = getDefaultPaneWidth(width)
            setPaneWidth(defaultWidth)
            try {
              localStorage.setItem(widthStorageKey, defaultWidth.toString())
            } catch (_error) {
              // Ignore errors
            }
          }}
          className={classes.PaneVerticalDivider}
          style={
            {
              '--spacing': `var(--spacing-${columnGap})`,
            } as React.CSSProperties
          }
        />
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
