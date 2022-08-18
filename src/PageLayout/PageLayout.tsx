import React from 'react'
import {useStickyPaneHeight} from './useStickyPaneHeight'
import {Box} from '..'
import {isResponsiveValue, ResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import {BetterSystemStyleObject, merge, SxProp} from '../sx'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4
}

const SPACING_MAP = {
  none: 0,
  condensed: 3,
  normal: [3, null, null, 4]
}

const PageLayoutContext = React.createContext<{
  padding: keyof typeof SPACING_MAP
  rowGap: keyof typeof SPACING_MAP
  columnGap: keyof typeof SPACING_MAP
  enableStickyPane?: (top: number | string) => void
  disableStickyPane?: () => void
  contentTopRef?: (node?: Element | null | undefined) => void
  contentBottomRef?: (node?: Element | null | undefined) => void
}>({
  padding: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
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
} & SxProp

const containerWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

// TODO: refs
const Root: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  containerWidth = 'xlarge',
  padding = 'normal',
  rowGap = 'normal',
  columnGap = 'normal',
  children,
  sx = {}
}) => {
  const {rootRef, enableStickyPane, disableStickyPane, contentTopRef, contentBottomRef, stickyPaneHeight} =
    useStickyPaneHeight()
  return (
    <PageLayoutContext.Provider
      value={{
        padding,
        rowGap,
        columnGap,
        enableStickyPane,
        disableStickyPane,
        contentTopRef,
        contentBottomRef
      }}
    >
      <Box
        ref={rootRef}
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TypeScript doesn't know about CSS custom properties
          '--sticky-pane-height': stickyPaneHeight
        }}
        sx={merge<BetterSystemStyleObject>({padding: SPACING_MAP[padding]}, sx)}
      >
        <Box
          sx={{
            maxWidth: containerWidths[containerWidth],
            marginX: 'auto',
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          {children}
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
} & SxProp

const horizontalDividerVariants = {
  none: {
    display: 'none'
  },
  line: {
    display: 'block',
    height: 1,
    backgroundColor: 'border.default'
  },
  filled: {
    display: 'block',
    height: 8,
    backgroundColor: 'canvas.inset',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boxShadow: (theme: any) =>
      `inset 0 -1px 0 0 ${theme.colors.border.default}, inset 0 1px 0 0 ${theme.colors.border.default}`
  }
}

function negateSpacingValue(value: number | null | Array<number | null>) {
  if (Array.isArray(value)) {
    // Not using recursion to avoid deeply nested arrays
    return value.map(v => (v === null ? null : -v))
  }

  return value === null ? null : -value
}

const HorizontalDivider: React.FC<React.PropsWithChildren<DividerProps>> = ({variant = 'none', sx = {}}) => {
  const {padding} = React.useContext(PageLayoutContext)
  const responsiveVariant = useResponsiveValue(variant, 'none')
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) =>
        merge<BetterSystemStyleObject>(
          {
            // Stretch divider to viewport edges on narrow screens
            marginX: negateSpacingValue(SPACING_MAP[padding]),
            ...horizontalDividerVariants[responsiveVariant],
            [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
              marginX: '0 !important'
            }
          },
          sx
        )
      }
    />
  )
}

const verticalDividerVariants = {
  none: {
    display: 'none'
  },
  line: {
    display: 'block',
    width: 1,
    backgroundColor: 'border.default'
  },
  filled: {
    display: 'block',
    width: 8,
    backgroundColor: 'canvas.inset',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boxShadow: (theme: any) =>
      `inset -1px 0 0 0 ${theme.colors.border.default}, inset 1px 0 0 0 ${theme.colors.border.default}`
  }
}

const VerticalDivider: React.FC<React.PropsWithChildren<DividerProps>> = ({variant = 'none', sx = {}}) => {
  const responsiveVariant = useResponsiveValue(variant, 'none')
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          height: '100%',
          ...verticalDividerVariants[responsiveVariant]
        },
        sx
      )}
    />
  )
}

// ----------------------------------------------------------------------------
// PageLayout.Header

export type PageLayoutHeaderProps = {
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
} & SxProp

const Header: React.FC<React.PropsWithChildren<PageLayoutHeaderProps>> = ({
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
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
    <Box
      as="header"
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
          order: REGION_ORDER.header,
          width: '100%',
          marginBottom: SPACING_MAP[rowGap]
        },
        sx
      )}
    >
      <Box sx={{padding: SPACING_MAP[padding]}}>{children}</Box>
      <HorizontalDivider variant={dividerVariant} sx={{marginTop: SPACING_MAP[rowGap]}} />
    </Box>
  )
}

Header.displayName = 'PageLayout.Header'

// ----------------------------------------------------------------------------
// PageLayout.Content

export type PageLayoutContentProps = {
  width?: keyof typeof contentWidths
  padding?: keyof typeof SPACING_MAP
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

// TODO: Account for pane width when centering content
const contentWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const Content: React.FC<React.PropsWithChildren<PageLayoutContentProps>> = ({
  width = 'full',
  padding = 'none',
  hidden = false,
  children,
  sx = {}
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  const {contentTopRef, contentBottomRef} = React.useContext(PageLayoutContext)
  return (
    <Box
      as="main"
      sx={merge<BetterSystemStyleObject>(
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
          minWidth: 1 // Hack to prevent overflowing content from pushing the pane region to the next line
        },
        sx
      )}
    >
      {/* Track the top of the content region so we can calculate the height of the pane region */}
      <Box ref={contentTopRef} />

      <Box
        sx={{
          width: '100%',
          maxWidth: contentWidths[width],
          marginX: 'auto',
          flexGrow: 1,
          padding: SPACING_MAP[padding]
        }}
      >
        {children}
      </Box>

      {/* Track the bottom of the content region so we can calculate the height of the pane region */}
      <Box ref={contentBottomRef} />
    </Box>
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
  width?: keyof typeof paneWidths
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
  stickyTop?: string | number
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const panePositions = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd
}

const paneWidths = {
  small: ['100%', null, '240px', '256px'],
  medium: ['100%', null, '256px', '296px'],
  large: ['100%', null, '256px', '320px', '336px']
}

const Pane: React.FC<React.PropsWithChildren<PageLayoutPaneProps>> = ({
  position: responsivePosition = 'end',
  positionWhenNarrow = 'inherit',
  width = 'medium',
  padding = 'none',
  divider: responsiveDivider = 'none',
  dividerWhenNarrow = 'inherit',
  sticky = false,
  stickyTop = 0,
  hidden: responsiveHidden = false,
  children,
  sx = {}
}) => {
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

  const {rowGap, columnGap, enableStickyPane, disableStickyPane} = React.useContext(PageLayoutContext)

  React.useEffect(() => {
    if (sticky) {
      enableStickyPane?.(stickyTop)
    } else {
      disableStickyPane?.()
    }
  }, [sticky, enableStickyPane, disableStickyPane, stickyTop])

  return (
    <Box
      as="aside"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) =>
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
                    // If stickyTop has value, it will stick the pane to the position where the sticky top ends
                    // else top will be 0 as the default value of stickyTop
                    top: stickyTop,
                    overflow: 'hidden',
                    maxHeight: 'var(--sticky-pane-height)'
                  }
                : {}),
              ...(position === 'end'
                ? {flexDirection: 'row', marginLeft: SPACING_MAP[columnGap]}
                : {flexDirection: 'row-reverse', marginRight: SPACING_MAP[columnGap]})
            }
          },
          sx
        )
      }
    >
      {/* Show a horizontal divider when viewport is narrow. Otherwise, show a vertical divider. */}
      <HorizontalDivider
        variant={{narrow: dividerVariant, regular: 'none'}}
        sx={{[position === 'end' ? 'marginBottom' : 'marginTop']: SPACING_MAP[rowGap]}}
      />
      <VerticalDivider
        variant={{narrow: 'none', regular: dividerVariant}}
        sx={{[position === 'end' ? 'marginRight' : 'marginLeft']: SPACING_MAP[columnGap]}}
      />

      <Box sx={{width: paneWidths[width], padding: SPACING_MAP[padding], overflow: 'auto'}}>{children}</Box>
    </Box>
  )
}

Pane.displayName = 'PageLayout.Pane'

// ----------------------------------------------------------------------------
// PageLayout.Footer

export type PageLayoutFooterProps = {
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
} & SxProp

const Footer: React.FC<React.PropsWithChildren<PageLayoutFooterProps>> = ({
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
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
    <Box
      as="footer"
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
          order: REGION_ORDER.footer,
          width: '100%',
          marginTop: SPACING_MAP[rowGap]
        },
        sx
      )}
    >
      <HorizontalDivider variant={dividerVariant} sx={{marginBottom: SPACING_MAP[rowGap]}} />
      <Box sx={{padding: SPACING_MAP[padding]}}>{children}</Box>
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
  Footer
})
