import React, {useRef} from 'react'
import {createGlobalStyle} from 'styled-components'
import {clsx} from 'clsx'
import Box from '../Box'
import {useId} from '../hooks/useId'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import {useSlots} from '../hooks/useSlots'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import {merge} from '../sx'
import type {Theme} from '../ThemeProvider'
import {canUseDOM} from '../utils/environment'
import {useOverflow} from '../hooks/useOverflow'
import {warning} from '../utils/warning'
import {useStickyPaneHeight} from './useStickyPaneHeight'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './PageLayout.module.css'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4,
}

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
  enableStickyPane?: (top: number | string) => void
  disableStickyPane?: () => void
  contentTopRef?: (node?: Element | null | undefined) => void
  contentBottomRef?: (node?: Element | null | undefined) => void
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
} & SxProp

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

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
  sx = {},
  className,
  style,
  _slotsConfig: slotsConfig,
}) => {
  const {rootRef, enableStickyPane, disableStickyPane, contentTopRef, contentBottomRef, stickyPaneHeight} =
    useStickyPaneHeight()

  const paneRef = useRef<HTMLDivElement>(null)
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const [slots, rest] = useSlots(children, slotsConfig ?? {header: Header, footer: Footer})

  const stylingProps = enabled
    ? {
        sx,
        className: clsx(classes.PageLayoutRoot, className),
      }
    : {
        sx: merge<BetterSystemStyleObject>({padding: SPACING_MAP[padding]}, sx),
        className,
      }

  const wrapperStylingProps = enabled
    ? {className: classes.PageLayoutWrapper, 'data-width': containerWidth}
    : {
        sx: {
          maxWidth: containerWidths[containerWidth],
          marginX: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
        },
      }

  const contentStylingProps = enabled
    ? {
        className: clsx(classes.PageLayoutContent, className),
      }
    : {
        sx: {display: 'flex', flex: '1 1 100%', flexWrap: 'wrap', maxWidth: '100%'},
      }

  return (
    <PageLayoutContext.Provider
      value={{
        padding,
        rowGap,
        columnGap,
        enableStickyPane,
        disableStickyPane,
        contentTopRef,
        contentBottomRef,
        paneRef,
      }}
    >
      <Box
        ref={rootRef}
        style={
          {
            '--sticky-pane-height': stickyPaneHeight,
            '--spacing': `var(--spacing-${padding})`,
            ...style,
          } as React.CSSProperties
        }
        {...stylingProps}
      >
        <Box {...wrapperStylingProps}>
          {slots.header}
          <Box {...contentStylingProps}>{rest}</Box>
          {slots.footer}
        </Box>
      </Box>
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
} & SxProp

const horizontalDividerVariants = {
  none: {
    display: 'none',
  },
  line: {
    display: 'block',
    height: 1,
    backgroundColor: 'border.default',
  },
  filled: {
    display: 'block',
    height: 8,
    backgroundColor: 'canvas.inset',
    boxShadow: (theme: Theme) =>
      `inset 0 -1px 0 0 ${theme.colors.border.default}, inset 0 1px 0 0 ${theme.colors.border.default}`,
  },
}

function negateSpacingValue(value: number | null | Array<number | null>) {
  if (Array.isArray(value)) {
    // Not using recursion to avoid deeply nested arrays
    return value.map(v => (v === null ? null : -v))
  }

  return value === null ? null : -value
}

const HorizontalDivider: React.FC<React.PropsWithChildren<DividerProps>> = ({
  variant = 'none',
  sx = {},
  className,
  position,
  style,
}) => {
  const {padding} = React.useContext(PageLayoutContext)
  const responsiveVariant = useResponsiveValue(variant, 'none')
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const stylingProps = enabled
    ? {
        sx,
        className: clsx(classes.HorizontalDivider, className),
        'data-variant': responsiveVariant,
        'data-position': position,
        style: {
          '--spacing-divider': `var(--spacing-${padding})`,
          ...style,
        } as React.CSSProperties,
      }
    : {
        sx: (theme: Theme) =>
          merge<BetterSystemStyleObject>(
            {
              // Stretch divider to viewport edges on narrow screens
              marginX: negateSpacingValue(SPACING_MAP[padding]),
              ...horizontalDividerVariants[responsiveVariant],
              [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
                marginX: '0 !important',
              },
            },
            sx,
          ),
        className,
        style,
      }

  return <Box {...stylingProps} />
}

const verticalDividerVariants = {
  none: {
    display: 'none',
  },
  line: {
    display: 'block',
    width: 1,
    backgroundColor: 'border.default',
  },
  filled: {
    display: 'block',
    width: 8,
    backgroundColor: 'canvas.inset',
    boxShadow: (theme: Theme) =>
      `inset -1px 0 0 0 ${theme.colors.border.default}, inset 1px 0 0 0 ${theme.colors.border.default}`,
  },
}

type DraggableDividerProps = {
  draggable?: boolean
  onDragStart?: () => void
  onDrag?: (delta: number, isKeyboard: boolean) => void
  onDragEnd?: () => void
  onDoubleClick?: () => void
}

const DraggingGlobalStyles = createGlobalStyle`
  /* Maintain resize cursor while dragging */
  body[data-page-layout-dragging="true"] {
    cursor: col-resize;
  }

  /* Disable text selection while dragging */
  body[data-page-layout-dragging="true"] * {
    user-select: none;
  }
`

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
  sx = {},
}) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isKeyboardDrag, setIsKeyboardDrag] = React.useState(false)
  const responsiveVariant = useResponsiveValue(variant, 'none')
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

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

  const stylingProps = enabled
    ? {
        sx,
        className: clsx(classes.VerticalDivider, className),
        'data-variant': responsiveVariant,
        'data-position': position,
        style,
      }
    : {
        sx: merge<BetterSystemStyleObject>(
          {
            height: '100%',
            position: 'relative',
            ...verticalDividerVariants[responsiveVariant],
          },
          sx,
        ),
        className,
        style,
      }

  return (
    <Box {...stylingProps}>
      {draggable ? (
        // Drag handle
        <>
          <Box
            sx={{
              position: 'absolute',
              inset: '0 -2px',
              cursor: 'col-resize',
              bg: isDragging || isKeyboardDrag ? 'accent.fg' : 'transparent',
              transitionDelay: '0.1s',
              '&:hover': {
                bg: isDragging || isKeyboardDrag ? 'accent.fg' : 'neutral.muted',
              },
            }}
            role="slider"
            aria-label="Draggable pane splitter"
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            aria-valuenow={currentWidth}
            aria-valuetext={`Pane width ${currentWidth} pixels`}
            tabIndex={0}
            onMouseDown={event => {
              if (event.button === 0) {
                setIsDragging(true)
                onDragStart?.()
              }
            }}
            onKeyDown={event => {
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
          {!enabled && <DraggingGlobalStyles />}
        </>
      ) : null}
    </Box>
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
} & SxProp

const Header: React.FC<React.PropsWithChildren<PageLayoutHeaderProps>> = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  style,
  sx = {},
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
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const headerStylingProps = enabled
    ? {
        sx,
        className: clsx(classes.Header, className),
        style: {
          '--spacing': `var(--spacing-${rowGap})`,
        } as React.CSSProperties,
      }
    : {
        sx: merge<BetterSystemStyleObject>(
          {
            width: '100%',
            marginBottom: SPACING_MAP[rowGap],
          },
          sx,
        ),
        className,
      }

  const contentStylingProps = enabled
    ? {
        className: classes.HeaderContent,
        style: {
          '--spacing': `var(--spacing-${padding})`,
        } as React.CSSProperties,
      }
    : {
        sx: {
          padding: SPACING_MAP[padding],
        },
      }

  const dividerStylingProps = enabled
    ? {
        className: classes.HeaderHorizontalDivider,
        style: {
          '--spacing': `var(--spacing-${rowGap})`,
        } as React.CSSProperties,
      }
    : {
        sx: {
          marginTop: SPACING_MAP[rowGap],
        },
      }

  return (
    <Box
      as="header"
      aria-label={label}
      aria-labelledby={labelledBy}
      hidden={isHidden}
      style={style}
      {...headerStylingProps}
    >
      <Box {...contentStylingProps}>{children}</Box>
      <HorizontalDivider variant={dividerVariant} {...dividerStylingProps} />
    </Box>
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
} & SxProp

// TODO: Account for pane width when centering content
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
  sx = {},
  className,
  style,
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  const {contentTopRef, contentBottomRef} = React.useContext(PageLayoutContext)
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const wrapperStylingProps = enabled
    ? {
        sx,
        className: clsx(classes.ContentWrapper, className),
        'data-is-hidden': isHidden,
      }
    : {
        sx: merge<BetterSystemStyleObject>(
          {
            display: isHidden ? 'none' : 'flex',
            flexDirection: 'column',
            order: REGION_ORDER.content,
            // Set flex-basis to 0% to allow flex-grow to control the width of the content region.
            // Without this, the content region could wrap onto a different line
            // than the pane region on wide viewports if its contents are too wide.
            flexBasis: 0,
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 1, // Hack to prevent overflowing content from pushing the pane region to the next line
          },
          sx,
        ),
        className,
      }

  const stylingProps = enabled
    ? {
        className: classes.Content,
        'data-width': width,
        style: {
          '--spacing': `var(--spacing-${padding})`,
        } as React.CSSProperties,
      }
    : {
        sx: {
          width: '100%',
          maxWidth: contentWidths[width],
          marginX: 'auto',
          flexGrow: 1,
          padding: SPACING_MAP[padding],
        },
      }

  return (
    <Box as={as} aria-label={label} aria-labelledby={labelledBy} style={style} {...wrapperStylingProps}>
      {/* Track the top of the content region so we can calculate the height of the pane region */}
      <Box ref={contentTopRef} />

      <Box {...stylingProps}>{children}</Box>

      {/* Track the bottom of the content region so we can calculate the height of the pane region */}
      <Box ref={contentBottomRef} />
    </Box>
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
} & SxProp

const panePositions = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd,
}

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
      sx = {},
      className,
      style,
    },
    forwardRef,
  ) => {
    const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

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

    const {rowGap, columnGap, enableStickyPane, disableStickyPane, paneRef} = React.useContext(PageLayoutContext)

    React.useEffect(() => {
      if (sticky) {
        enableStickyPane?.(offsetHeader)
      } else {
        disableStickyPane?.()
      }
    }, [sticky, enableStickyPane, disableStickyPane, offsetHeader])

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
      } catch (error) {
        storedWidth = null
      }

      return storedWidth && !isNaN(Number(storedWidth)) ? Number(storedWidth) : getDefaultPaneWidth(width)
    })

    const updatePaneWidth = (width: number) => {
      setPaneWidth(width)

      try {
        localStorage.setItem(widthStorageKey, width.toString())
      } catch (error) {
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

    const paneWrapperStylingProps = enabled
      ? {
          sx,
          className: clsx(classes.PaneWrapper, className),
          style: {
            '--offset-header': typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
            '--spacing-row': `var(--spacing-${rowGap})`,
            '--spacing-column': `var(--spacing-${columnGap})`,
            ...style,
          },
          'data-is-hidden': isHidden,
          'data-position': position,
          'data-sticky': sticky || undefined,
        }
      : {
          className,
          sx: (theme: Theme) =>
            merge<BetterSystemStyleObject>(
              {
                // Narrow viewports
                display: isHidden ? 'none' : 'flex',
                order: panePositions[position],
                width: '100%',
                marginX: 0,
                ...(position === 'end'
                  ? {flexDirection: 'column', marginTop: SPACING_MAP[rowGap]}
                  : {flexDirection: 'column-reverse', marginBottom: SPACING_MAP[rowGap]}),

                // Regular and wide viewports
                [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
                  width: 'auto',
                  marginY: '0 !important',
                  ...(sticky
                    ? {
                        position: 'sticky',
                        // If offsetHeader has value, it will stick the pane to the position where the sticky top ends
                        // else top will be 0 as the default value of offsetHeader
                        top: typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
                        maxHeight: 'var(--sticky-pane-height)',
                      }
                    : {}),
                  ...(position === 'end'
                    ? {flexDirection: 'row-reverse', marginLeft: SPACING_MAP[columnGap]}
                    : {flexDirection: 'row', marginRight: SPACING_MAP[columnGap]}),
                },
              },
              sx,
            ),
          style,
        }

    const horizontalDividerStylingProps = enabled
      ? {
          className: classes.PaneHorizontalDivider,
          style: {
            '--spacing': `var(--spacing-${rowGap})`,
          } as React.CSSProperties,
        }
      : {
          sx: {
            [position === 'end' ? 'marginBottom' : 'marginTop']: SPACING_MAP[rowGap],
          },
        }

    const verticalDividerStylingProps = enabled
      ? {
          className: classes.PaneVerticalDivider,
          style: {
            '--spacing': `var(--spacing-${columnGap})`,
          } as React.CSSProperties,
        }
      : {
          sx: {
            [position === 'end' ? 'marginRight' : 'marginLeft']: SPACING_MAP[columnGap],
          },
        }

    const paneStylingProps = enabled
      ? {
          className: classes.Pane,
          'data-resizable': resizable || undefined,
          style: {
            '--spacing': `var(--spacing-${padding})`,
            '--pane-min-width': isCustomWidthOptions(width) ? width.min : `${minWidth}px`,
            '--pane-max-width': isCustomWidthOptions(width) ? width.max : `calc(100vw - var(--pane-max-width-diff))`,
            '--pane-width-custom': isCustomWidthOptions(width) ? width.default : undefined,
            '--pane-width-size': `var(--pane-width-${isPaneWidth(width) ? width : 'custom'})`,
            '--pane-width': `${paneWidth}px`,
          } as React.CSSProperties,
        }
      : {
          sx: (theme: Theme) => ({
            '--pane-min-width': isCustomWidthOptions(width) ? width.min : `${minWidth}px`,
            '--pane-max-width-diff': '511px',
            '--pane-max-width': isCustomWidthOptions(width) ? width.max : `calc(100vw - var(--pane-max-width-diff))`,
            width: resizable
              ? ['100%', null, `clamp(var(--pane-min-width), var(--pane-width), var(--pane-max-width))`]
              : isPaneWidth(width)
                ? paneWidths[width]
                : width.default,
            padding: SPACING_MAP[padding],
            overflow: [null, null, 'auto'],

            [`@media screen and (min-width: ${theme.breakpoints[3]})`]: {
              '--pane-max-width-diff': '959px',
            },
          }),
          style: {
            '--pane-width': `${paneWidth}px`,
          } as React.CSSProperties,
        }

    return (
      <Box {...paneWrapperStylingProps}>
        {/* Show a horizontal divider when viewport is narrow. Otherwise, show a vertical divider. */}
        <HorizontalDivider
          variant={{narrow: dividerVariant, regular: 'none'}}
          {...horizontalDividerStylingProps}
          position={position}
        />
        <Box
          ref={paneRef}
          {...(hasOverflow ? overflowProps : {})}
          {...labelProp}
          {...(id && {id: paneId})}
          {...paneStylingProps}
        >
          {children}
        </Box>
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
          {...verticalDividerStylingProps}
        />
      </Box>
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
} & SxProp

const Footer: React.FC<React.PropsWithChildren<PageLayoutFooterProps>> = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {},
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

  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const footerStylingProps = enabled
    ? {
        className: clsx(classes.FooterWrapper, className),
        sx,
        style: {
          '--spacing': `var(--spacing-${rowGap})`,
          ...style,
        } as React.CSSProperties,
      }
    : {
        className,
        sx: merge<BetterSystemStyleObject>(
          {
            order: REGION_ORDER.footer,
            width: '100%',
            marginTop: SPACING_MAP[rowGap],
          },
          sx,
        ),
        style,
      }
  const dividerStylingProps = enabled
    ? {
        className: classes.FooterHorizontalDivider,
        style: {
          '--spacing': `var(--spacing-${rowGap})`,
        } as React.CSSProperties,
      }
    : {
        sx: {
          marginBottom: SPACING_MAP[rowGap],
        },
      }
  const contentStylingProps = enabled
    ? {
        className: classes.FooterContent,
        style: {
          '--spacing': `var(--spacing-${padding})`,
        } as React.CSSProperties,
      }
    : {
        sx: {
          padding: SPACING_MAP[padding],
        },
      }

  return (
    <Box as="footer" aria-label={label} aria-labelledby={labelledBy} hidden={isHidden} {...footerStylingProps}>
      <HorizontalDivider {...dividerStylingProps} variant={dividerVariant} />
      <Box {...contentStylingProps}>{children}</Box>
    </Box>
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
