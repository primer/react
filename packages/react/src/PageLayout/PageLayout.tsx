import React, {useRef} from 'react'
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
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

/**
 * Default value for --pane-max-width-diff CSS variable.
 * This is the fallback when the element isn't mounted or value can't be read.
 */
const DEFAULT_MAX_WIDTH_DIFF = 511

/**
 * Gets the --pane-max-width-diff CSS variable value from a pane element.
 * This value is set by CSS media queries and controls the max pane width constraint.
 * Note: This calls getComputedStyle which forces layout - cache the result when possible.
 */
function getPaneMaxWidthDiff(paneElement: HTMLElement | null): number {
  if (!paneElement) return DEFAULT_MAX_WIDTH_DIFF
  const value = parseInt(getComputedStyle(paneElement).getPropertyValue('--pane-max-width-diff'), 10)
  return value > 0 ? value : DEFAULT_MAX_WIDTH_DIFF
}

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

type VerticalDividerProps = DividerProps & {
  draggable?: boolean
}

const VerticalDivider: React.FC<React.PropsWithChildren<VerticalDividerProps>> = ({
  variant = 'none',
  position,
  className,
  style,
  children,
}) => {
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
}

type DragHandleProps = {
  handleRef: React.RefObject<HTMLDivElement>
  onDrag: (delta: number, isKeyboard: boolean) => void
  onDragEnd: () => void
  onDoubleClick: () => void
  // ARIA slider values - set in JSX for SSR, updated via DOM manipulation during drag
  ariaValueMin?: number
  ariaValueMax?: number
  ariaValueNow?: number
}

// Helper to update ARIA slider attributes via direct DOM manipulation
// This avoids re-renders when values change during drag or on viewport resize
const updateAriaValues = (handle: HTMLElement | null, values: {current?: number; min?: number; max?: number}) => {
  if (!handle) return
  if (values.min !== undefined) handle.setAttribute('aria-valuemin', String(values.min))
  if (values.max !== undefined) handle.setAttribute('aria-valuemax', String(values.max))
  if (values.current !== undefined) {
    handle.setAttribute('aria-valuenow', String(values.current))
    handle.setAttribute('aria-valuetext', `Pane width ${values.current} pixels`)
  }
}

const DATA_DRAGGING_ATTR = 'data-dragging'
const isDragging = (handle: HTMLElement | null) => {
  return handle?.getAttribute(DATA_DRAGGING_ATTR) === 'true'
}

/**
 * DragHandle - handles all pointer and keyboard interactions for resizing
 * ARIA values are set in JSX for SSR accessibility,
 * then updated via DOM manipulation during drag for performance
 */
const DragHandle: React.FC<DragHandleProps> = ({
  handleRef,
  onDrag,
  onDragEnd,
  onDoubleClick,
  ariaValueMin,
  ariaValueMax,
  ariaValueNow,
}) => {
  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)
  React.useEffect(() => {
    stableOnDrag.current = onDrag
    stableOnDragEnd.current = onDragEnd
  })

  const {paneRef} = React.useContext(PageLayoutContext)

  /**
   * Pointer down starts a drag operation
   * Capture the pointer to continue receiving events outside the handle area
   * Set a data attribute to indicate dragging state
   */
  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    target.setAttribute(DATA_DRAGGING_ATTR, 'true')
  }, [])

  /**
   * Pointer move during drag
   * Calls onDrag with movement delta
   * Prevents default to avoid unwanted selection behavior
   */
  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging(handleRef.current)) return
      event.preventDefault()

      if (event.movementX !== 0) {
        stableOnDrag.current(event.movementX, false)
      }
    },
    [handleRef],
  )

  /**
   * Pointer up ends a drag operation
   * Prevents default to avoid unwanted selection behavior
   */
  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging(handleRef.current)) return
      event.preventDefault()
      // Cleanup will happen in onLostPointerCapture
    },
    [handleRef],
  )

  /**
   * Lost pointer capture ends a drag operation
   * Cleans up dragging state
   * Calls onDragEnd callback
   */
  const handleLostPointerCapture = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging(handleRef.current)) return
      const target = event.currentTarget
      target.removeAttribute(DATA_DRAGGING_ATTR)
      stableOnDragEnd.current()
    },
    [handleRef],
  )

  /**
   * Keyboard handling for accessibility
   * Arrow keys adjust the pane size in 3px increments
   * Prevents default scrolling behavior
   * Sets and clears dragging state via data attribute
   * Calls onDrag
   */
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()

        if (!paneRef.current) return

        // https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
        const delta = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -3 : 3

        event.currentTarget.setAttribute(DATA_DRAGGING_ATTR, 'true')
        stableOnDrag.current(delta, true)
      }
    },
    [paneRef],
  )

  const handleKeyUp = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      event.preventDefault()
      event.currentTarget.removeAttribute(DATA_DRAGGING_ATTR)
      stableOnDragEnd.current()
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

const getDefaultPaneWidth = (w: PaneWidth | CustomWidthOptions): number => {
  if (isPaneWidth(w)) {
    return defaultPaneWidth[w]
  } else if (isCustomWidthOptions(w)) {
    return parseInt(w.default, 10)
  }
  return 0
}

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

    // Initial pane width for the first render - only used to set the initial CSS variable.
    // After mount, all updates go directly to the DOM via style.setProperty() to avoid re-renders.
    const [defaultWidth, setDefaultWidth] = React.useState(() => getDefaultPaneWidth(width))

    // Track current width during drag - initialized lazily in layout effect
    const currentWidthRef = React.useRef(defaultWidth)

    // Track whether we've initialized the width from localStorage
    const initializedRef = React.useRef(false)

    useIsomorphicLayoutEffect(() => {
      // Only initialize once on mount - subsequent updates come from drag operations
      if (initializedRef.current || !resizable) return
      initializedRef.current = true
      // Before paint, check localStorage for a stored width
      try {
        const value = localStorage.getItem(widthStorageKey)
        if (value !== null && !isNaN(Number(value))) {
          const num = Number(value)
          currentWidthRef.current = num
          paneRef.current?.style.setProperty('--pane-width', `${num}px`)
          setDefaultWidth(num)
          return
        }
      } catch {
        // localStorage unavailable - keep default
      }
    }, [widthStorageKey, paneRef, resizable])

    // Calculate min width constraint from width configuration
    const minPaneWidth = isCustomWidthOptions(width) ? parseInt(width.min, 10) : minWidth

    // Cache the CSS variable value to avoid getComputedStyle during drag (causes layout thrashing)
    // Updated on mount and resize when breakpoints might change
    const maxWidthDiffRef = React.useRef(DEFAULT_MAX_WIDTH_DIFF)

    // Calculate max width constraint using cached maxWidthDiff
    const getMaxPaneWidth = React.useCallback(() => {
      if (isCustomWidthOptions(width)) {
        return parseInt(width.max, 10)
      }
      const viewportWidth = window.innerWidth
      return viewportWidth > 0 ? Math.max(minPaneWidth, viewportWidth - maxWidthDiffRef.current) : minPaneWidth
    }, [width, minPaneWidth])

    // Max pane width for React state - SSR uses a sensible default, updated on mount
    // This is used for ARIA attributes in JSX to ensure SSR accessibility
    const getInitialMaxPaneWidth = () => {
      if (isCustomWidthOptions(width)) {
        return parseInt(width.max, 10)
      }
      // SSR-safe default: use a reasonable max based on typical viewport
      // This will be updated in layout effect before paint
      return 600
    }
    const [maxPaneWidth, setMaxPaneWidth] = React.useState(getInitialMaxPaneWidth)

    // Ref to the drag handle for updating ARIA attributes
    const handleRef = React.useRef<HTMLDivElement>(null)

    const getMaxPaneWidthRef = React.useRef(getMaxPaneWidth)
    useIsomorphicLayoutEffect(() => {
      getMaxPaneWidthRef.current = getMaxPaneWidth
    })
    // Update max pane width on mount and window resize for accurate ARIA values
    // Window resize events only fire on actual viewport changes (not content changes),
    // so this doesn't cause the INP issues that ResizeObserver on document.documentElement did
    useIsomorphicLayoutEffect(() => {
      const updateMax = () => {
        // Update cached CSS variable value (only getComputedStyle call happens here, not during drag)
        maxWidthDiffRef.current = getPaneMaxWidthDiff(paneRef.current)
        const actualMax = getMaxPaneWidthRef.current()
        setMaxPaneWidth(actualMax)
        // Clamp current width if it exceeds new max (viewport shrunk)
        if (currentWidthRef.current > actualMax) {
          currentWidthRef.current = actualMax
          paneRef.current?.style.setProperty('--pane-width', `${actualMax}px`)
          setDefaultWidth(actualMax)
        }
        updateAriaValues(handleRef.current, {max: actualMax, current: currentWidthRef.current})
      }
      updateMax()

      // Throttle resize handler to animation frames
      let rafId: number | null = null
      const throttledUpdateMax = () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(updateMax)
      }

      // ResizeObserver on document.documentElement fires on any content change (typing, etc),
      // causing INP regressions. Window resize only fires on viewport changes.
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', throttledUpdateMax)
      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('resize', throttledUpdateMax)
      }
    }, [minPaneWidth, paneRef])

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

    const setDefaultWidthAndStoreInLocalStorage = (value: number) => {
      setDefaultWidth(currentWidthRef.current!)
      try {
        localStorage.setItem(widthStorageKey, value.toString())
      } catch {
        // Ignore write errors
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
              // Set --pane-width to default on initial render (SSR-safe).
              // Layout effect updates it from localStorage before paint to avoid CLS.
              '--pane-width': resizable ? `${defaultWidth}px` : undefined,
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
          // Reset pane width on double click

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
              // ARIA slider values for SSR accessibility - updated via DOM during drag
              ariaValueMin={minPaneWidth}
              ariaValueMax={maxPaneWidth}
              ariaValueNow={defaultWidth}
              onDrag={(delta, isKeyboard = false) => {
                const deltaWithDirection = isKeyboard ? delta : position === 'end' ? -delta : delta
                const maxWidth = getMaxPaneWidth()

                if (isKeyboard) {
                  // Clamp keyboard delta to stay within bounds
                  const newWidth = Math.max(
                    minPaneWidth,
                    Math.min(maxWidth, currentWidthRef.current! + deltaWithDirection),
                  )
                  if (newWidth !== currentWidthRef.current) {
                    currentWidthRef.current = newWidth
                    paneRef.current?.style.setProperty('--pane-width', `${newWidth}px`)
                    updateAriaValues(handleRef.current, {current: newWidth, max: maxWidth})
                  }
                } else {
                  // Apply delta directly via CSS variable for immediate visual feedback
                  if (paneRef.current) {
                    const newWidth = currentWidthRef.current! + deltaWithDirection
                    const clampedWidth = Math.max(minPaneWidth, Math.min(maxWidth, newWidth))

                    // Only update if the clamped width actually changed
                    // This prevents drift when dragging against min/max constraints
                    if (clampedWidth !== currentWidthRef.current) {
                      paneRef.current.style.setProperty('--pane-width', `${clampedWidth}px`)
                      currentWidthRef.current = clampedWidth
                      updateAriaValues(handleRef.current, {current: clampedWidth, max: maxWidth})
                    }
                  }
                }
              }}
              // Save final width to localStorage and sync React state
              onDragEnd={() => {
                // The CSS variable is already set and currentWidthRef is in sync.
                // We sync React state so parent re-renders use the correct width.
                // This causes one re-render after drag ends, but ensures consistency.
                setDefaultWidthAndStoreInLocalStorage(currentWidthRef.current!)
              }}
              onDoubleClick={() => {
                const resetWidth = getDefaultPaneWidth(width)
                // Update CSS variable and ref directly
                if (paneRef.current) {
                  paneRef.current.style.setProperty('--pane-width', `${resetWidth}px`)
                  currentWidthRef.current = resetWidth
                  updateAriaValues(handleRef.current, {current: resetWidth})
                }
                setDefaultWidthAndStoreInLocalStorage(resetWidth)
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
