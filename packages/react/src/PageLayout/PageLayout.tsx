import React, {useRef} from 'react'
import {clsx} from 'clsx'
import {useId} from '../hooks/useId'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import {useSlots} from '../hooks/useSlots'
import {canUseDOM} from '../utils/environment'
import {useOverflow} from '../hooks/useOverflow'
import {warning} from '../utils/warning'

import classes from './PageLayout.module.css'

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
  position?: keyof typeof panePositions
}

const HorizontalDivider: React.FC<React.PropsWithChildren<DividerProps>> = ({
  variant = 'none',
  className,
  position,
  style,
}) => {
  const {padding} = React.useContext(PageLayoutContext)
  const responsiveVariant = useResponsiveValue(variant, 'none')

  return (
    <div
      className={clsx(classes.HorizontalDivider, className)}
      data-variant={responsiveVariant}
      data-position={position}
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
  const [isDragging, setIsDragging] = React.useState(false)
  const [isKeyboardDrag, setIsKeyboardDrag] = React.useState(false)
  const responsiveVariant = useResponsiveValue(variant, 'none')

  const stableOnDrag = React.useRef(onDrag)
  const stableOnDragEnd = React.useRef(onDragEnd)

  const {paneRef} = React.useContext(PageLayoutContext)

  const [minWidth, setMinWidth] = React.useState(0)
  const [maxWidth, setMaxWidth] = React.useState(0)
  const [currentWidth, setCurrentWidth] = React.useState(0)

  React.useEffect(() => {
    if (paneRef.current !== null) {
      const paneStyles = getComputedStyle(paneRef.current as Element)
      const maxPaneWidthDiffPixels = paneStyles.getPropertyValue('--pane-max-width-diff')
      const minWidthPixels = paneStyles.getPropertyValue('--pane-min-width')
      const paneWidth = paneRef.current.getBoundingClientRect().width
      const maxPaneWidthDiff = Number(maxPaneWidthDiffPixels.split('px')[0])
      const minPaneWidth = Number(minWidthPixels.split('px')[0])
      const viewportWidth = window.innerWidth
      const maxPaneWidth = viewportWidth > maxPaneWidthDiff ? viewportWidth - maxPaneWidthDiff : viewportWidth
      setMinWidth(minPaneWidth)
      setMaxWidth(maxPaneWidth)
      setCurrentWidth(paneWidth || 0)
    }
  }, [paneRef, isKeyboardDrag, isDragging])

  React.useEffect(() => {
    stableOnDrag.current = onDrag
  }, [onDrag])

  React.useEffect(() => {
    stableOnDragEnd.current = onDragEnd
  }, [onDragEnd])

  React.useEffect(() => {
    function handleDrag(event: MouseEvent) {
      stableOnDrag.current?.(event.movementX, false)
      event.preventDefault()
    }

    function handleDragEnd(event: MouseEvent) {
      setIsDragging(false)
      stableOnDragEnd.current?.()
      event.preventDefault()
    }

    function handleKeyDrag(event: KeyboardEvent) {
      let delta = 0
      // https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowDown') && currentWidth > minWidth) {
        delta = -3
      } else if ((event.key === 'ArrowRight' || event.key === 'ArrowUp') && currentWidth < maxWidth) {
        delta = 3
      } else {
        return
      }
      setCurrentWidth(currentWidth + delta)
      stableOnDrag.current?.(delta, true)
      event.preventDefault()
    }

    function handleKeyDragEnd(event: KeyboardEvent) {
      setIsKeyboardDrag(false)
      stableOnDragEnd.current?.()
      event.preventDefault()
    }
    // TODO: Support touch events
    if (isDragging || isKeyboardDrag) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('keydown', handleKeyDrag)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('keyup', handleKeyDragEnd)
      const body = document.body as HTMLElement | undefined
      body?.setAttribute('data-page-layout-dragging', 'true')
    } else {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('keydown', handleKeyDrag)
      window.removeEventListener('keyup', handleKeyDragEnd)
      const body = document.body as HTMLElement | undefined
      body?.removeAttribute('data-page-layout-dragging')
    }

    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('keydown', handleKeyDrag)
      window.removeEventListener('keyup', handleKeyDragEnd)
      const body = document.body as HTMLElement | undefined
      body?.removeAttribute('data-page-layout-dragging')
    }
  }, [isDragging, isKeyboardDrag, currentWidth, minWidth, maxWidth])

  return (
    <div
      className={clsx(classes.VerticalDivider, className)}
      data-variant={responsiveVariant}
      data-position={position}
      style={style}
    >
      {draggable ? (
        // Drag handle
        <div
          className={classes.DraggableHandle}
          data-dragging={isDragging || isKeyboardDrag}
          role="slider"
          aria-label="Draggable pane splitter"
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          aria-valuenow={currentWidth}
          aria-valuetext={`Pane width ${currentWidth} pixels`}
          tabIndex={0}
          onMouseDown={(event: React.MouseEvent) => {
            if (event.button === 0) {
              setIsDragging(true)
              onDragStart?.()
            }
          }}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (
              event.key === 'ArrowLeft' ||
              event.key === 'ArrowRight' ||
              event.key === 'ArrowUp' ||
              event.key === 'ArrowDown'
            ) {
              setIsKeyboardDrag(true)
              onDragStart?.()
            }
          }}
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

const Header: React.FC<React.PropsWithChildren<PageLayoutHeaderProps>> = ({
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

  const dividerVariant = useResponsiveValue(dividerProp, 'none')
  const isHidden = useResponsiveValue(hidden, false)
  const {rowGap} = React.useContext(PageLayoutContext)

  return (
    <header
      aria-label={label}
      aria-labelledby={labelledBy}
      hidden={isHidden}
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
        variant={dividerVariant}
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

const Content: React.FC<React.PropsWithChildren<PageLayoutContentProps>> = ({
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
  const isHidden = useResponsiveValue(hidden, false)
  const Component = as

  return (
    <Component
      aria-label={label}
      aria-labelledby={labelledBy}
      style={style}
      className={clsx(classes.ContentWrapper, className)}
      data-is-hidden={isHidden}
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

    const position = useResponsiveValue(positionProp, 'end')

    // Combine divider and dividerWhenNarrow for backwards compatibility
    const dividerProp =
      !isResponsiveValue(responsiveDivider) && dividerWhenNarrow !== 'inherit'
        ? {regular: responsiveDivider, narrow: dividerWhenNarrow}
        : responsiveDivider

    const dividerVariant = useResponsiveValue(dividerProp, 'none')

    const isHidden = useResponsiveValue(responsiveHidden, false)

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

    const updatePaneWidth = (width: number) => {
      setPaneWidth(width)

      try {
        localStorage.setItem(widthStorageKey, width.toString())
      } catch (_error) {
        // Ignore errors
      }
    }

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
        data-is-hidden={isHidden}
        data-position={position}
        data-sticky={sticky || undefined}
      >
        {/* Show a horizontal divider when viewport is narrow. Otherwise, show a vertical divider. */}
        <HorizontalDivider
          variant={{narrow: dividerVariant, regular: 'none'}}
          className={classes.PaneHorizontalDivider}
          style={
            {
              '--spacing': `var(--spacing-${rowGap})`,
            } as React.CSSProperties
          }
          position={position}
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
          variant={{
            narrow: 'none',
            // If pane is resizable, always show a vertical divider on regular viewports
            regular: resizable ? 'line' : dividerVariant,
          }}
          // If pane is resizable, the divider should be draggable
          draggable={resizable}
          onDrag={(delta, isKeyboard = false) => {
            // Get the number of pixels the divider was dragged
            let deltaWithDirection
            if (isKeyboard) {
              deltaWithDirection = delta
            } else {
              deltaWithDirection = position === 'end' ? -delta : delta
            }
            updatePaneWidth(paneWidth + deltaWithDirection)
          }}
          // Ensure `paneWidth` state and actual pane width are in sync when the drag ends
          onDragEnd={() => {
            const paneRect = paneRef.current?.getBoundingClientRect()
            if (!paneRect) return
            updatePaneWidth(paneRect.width)
          }}
          position={position}
          // Reset pane width on double click
          onDoubleClick={() => updatePaneWidth(getDefaultPaneWidth(width))}
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

const Footer: React.FC<React.PropsWithChildren<PageLayoutFooterProps>> = ({
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

  const dividerVariant = useResponsiveValue(dividerProp, 'none')
  const isHidden = useResponsiveValue(hidden, false)
  const {rowGap} = React.useContext(PageLayoutContext)

  return (
    <footer
      aria-label={label}
      aria-labelledby={labelledBy}
      hidden={isHidden}
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
        variant={dividerVariant}
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
  Header,
  Content,
  Pane,
  Footer,
})
