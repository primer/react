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
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

// Module-scoped ResizeObserver subscription for viewport width tracking
let viewportWidthListeners: Set<() => void> | undefined
let viewportWidthObserver: ResizeObserver | undefined

function subscribeToViewportWidth(callback: () => void) {
  if (!viewportWidthListeners) {
    viewportWidthListeners = new Set()
    viewportWidthObserver = new ResizeObserver(() => {
      if (viewportWidthListeners) {
        for (const listener of viewportWidthListeners) {
          listener()
        }
      }
    })
    viewportWidthObserver.observe(document.documentElement)
  }

  viewportWidthListeners.add(callback)

  return () => {
    viewportWidthListeners?.delete(callback)
    if (viewportWidthListeners?.size === 0) {
      viewportWidthObserver?.disconnect()
      viewportWidthObserver = undefined
      viewportWidthListeners = undefined
    }
  }
}

function getViewportWidth() {
  return window.innerWidth
}

function getServerViewportWidth() {
  return 0
}

/**
 * Custom hook that subscribes to viewport width changes using a shared ResizeObserver
 */
function useViewportWidth() {
  return React.useSyncExternalStore(subscribeToViewportWidth, getViewportWidth, getServerViewportWidth)
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

type DraggableDividerProps = {
  draggable?: boolean
  minWidth?: number
  maxWidth?: number
  currentWidth: number
  onDragStart?: () => void
  onDrag?: (delta: number, isKeyboard: boolean) => void
  onDragEnd?: () => void
  onDoubleClick?: () => void
}

// Helper to update ARIA attributes (only valuenow/valuetext change dynamically)
const updateAriaValue = (handle: HTMLElement | null, width: number) => {
  if (handle) {
    handle.setAttribute('aria-valuenow', String(width))
    handle.setAttribute('aria-valuetext', `Pane width ${width} pixels`)
  }
}

const DATA_DRAGGING_ATTR = 'data-dragging'
const isDragging = (handle: HTMLElement | null) => {
  return handle?.getAttribute(DATA_DRAGGING_ATTR) === 'true'
}

const VerticalDivider: React.FC<React.PropsWithChildren<DividerProps & DraggableDividerProps>> = ({
  variant = 'none',
  draggable = false,
  minWidth = 256,
  maxWidth = 1024,
  currentWidth,
  onDragStart,
  onDrag,
  onDragEnd,
  onDoubleClick,
  position,
  className,
  style,
}) => {
  const stableOnDragStart = React.useRef(onDragStart)
  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)
  React.useEffect(() => {
    stableOnDrag.current = onDrag
    stableOnDragEnd.current = onDragEnd
    stableOnDragStart.current = onDragStart
  })

  const {paneRef} = React.useContext(PageLayoutContext)
  const handleRef = React.useRef<HTMLDivElement>(null)

  // Initialize static ARIA attributes on mount
  React.useEffect(() => {
    // Set dynamic attributes
    updateAriaValue(handleRef.current, currentWidth)
  }, [currentWidth])

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    target.setAttribute(DATA_DRAGGING_ATTR, 'true')

    stableOnDragStart.current?.()
  }, [])

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging(handleRef.current)) return
    event.preventDefault()

    if (event.movementX !== 0) {
      stableOnDrag.current?.(event.movementX, false)
    }
  }, [])

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging(handleRef.current)) return
    event.preventDefault()
    // Cleanup will happen in onLostPointerCapture
  }, [])

  const handleLostPointerCapture = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging(handleRef.current)) return
      const target = event.currentTarget
      target.removeAttribute(DATA_DRAGGING_ATTR)

      // Update ARIA with final width after drag completes
      if (paneRef.current) {
        const finalWidth = Math.round(paneRef.current.getBoundingClientRect().width)
        updateAriaValue(handleRef.current, finalWidth)
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

        if (!paneRef.current) return

        let delta = 0
        // https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowDown') && currentWidth > minWidth) {
          delta = -3
        } else if ((event.key === 'ArrowRight' || event.key === 'ArrowUp') && currentWidth < maxWidth) {
          delta = 3
        }

        if (delta !== 0) {
          event.currentTarget.setAttribute(DATA_DRAGGING_ATTR, 'true')
          stableOnDrag.current?.(delta, true)

          // Update ARIA after keyboard resize
          const newWidth = Math.round(paneRef.current.getBoundingClientRect().width)
          updateAriaValue(handleRef.current, newWidth)
        }
      }
    },
    [paneRef, currentWidth, minWidth, maxWidth],
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
        // Drag handle
        <div
          ref={handleRef}
          className={classes.DraggableHandle}
          role="slider"
          aria-label="Draggable pane splitter"
          tabIndex={0}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          // aria-valuenow - OPTIMIZATION: set dynamically during drag and on startup.
          // aria-valuetext - OPTIMIZATION: set dynamically during drag and on startup.
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

    // Track current width during drag to avoid reading stale state
    const currentWidthRef = React.useRef(paneWidth)
    React.useEffect(() => {
      currentWidthRef.current = paneWidth
    }, [paneWidth])

    // Set --pane-width via layout effect. This runs on every render to ensure
    // the CSS variable reflects currentWidthRef (which may differ from state after drag).
    // We intentionally have no deps array - we want this to run on every render.
    useIsomorphicLayoutEffect(() => {
      paneRef.current?.style.setProperty('--pane-width', `${currentWidthRef.current}px`)
    })

    // Subscribe to viewport width changes for responsive max constraint calculation
    const viewportWidth = useViewportWidth()

    // Calculate constraints from width configuration
    const paneConstraints = React.useMemo(() => {
      const minPaneWidth = isCustomWidthOptions(width) ? Number(width.min.split('px')[0]) : minWidth

      let maxPaneWidth: number
      if (isCustomWidthOptions(width)) {
        maxPaneWidth = Number(width.max.split('px')[0])
      } else {
        // Use CSS variable logic: calc(100vw - var(--pane-max-width-diff))
        // maxWidthDiff matches CSS: 959px for wide (≥1280px), 511px otherwise
        const maxWidthDiff = viewportWidth >= 1280 ? 959 : 511
        maxPaneWidth = viewportWidth > 0 ? Math.max(minPaneWidth, viewportWidth - maxWidthDiff) : minPaneWidth
      }

      return {minWidth: minPaneWidth, maxWidth: maxPaneWidth}
    }, [width, minWidth, viewportWidth])

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

    const setWidthInLocalStorage = (value: number) => {
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
              // Note: --pane-width is set via useLayoutEffect to prevent re-renders from resetting it
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
          minWidth={paneConstraints.minWidth}
          maxWidth={paneConstraints.maxWidth}
          currentWidth={paneWidth}
          onDrag={(delta, isKeyboard = false) => {
            const deltaWithDirection = isKeyboard ? delta : position === 'end' ? -delta : delta

            if (isKeyboard) {
              setPaneWidth(prev => prev + deltaWithDirection)
            } else {
              // Apply delta directly via CSS variable for immediate visual feedback
              if (paneRef.current) {
                const newWidth = currentWidthRef.current + deltaWithDirection
                const clampedWidth = Math.max(paneConstraints.minWidth, Math.min(paneConstraints.maxWidth, newWidth))

                // Only update if the clamped width actually changed
                // This prevents drift when dragging against min/max constraints
                if (clampedWidth !== currentWidthRef.current) {
                  paneRef.current.style.setProperty('--pane-width', `${clampedWidth}px`)
                  currentWidthRef.current = clampedWidth
                }
              }
            }
          }}
          // Save final width to localStorage (skip React state update to avoid reconciliation)
          onDragEnd={() => {
            // For mouse drag: The CSS variable is already set and currentWidthRef is in sync.
            // We intentionally skip setPaneWidth() to avoid triggering expensive React
            // reconciliation with large DOM trees. The ref is the source of truth for
            // subsequent drag operations.
            setWidthInLocalStorage(currentWidthRef.current)
          }}
          position={positionProp}
          // Reset pane width on double click
          onDoubleClick={() => {
            const defaultWidth = getDefaultPaneWidth(width)
            // Update CSS variable and ref directly - skip React state to avoid reconciliation
            if (paneRef.current) {
              paneRef.current.style.setProperty('--pane-width', `${defaultWidth}px`)
              currentWidthRef.current = defaultWidth
            }
            setWidthInLocalStorage(defaultWidth)
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
