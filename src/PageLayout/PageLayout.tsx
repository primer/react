import React from 'react'
import {Box} from '..'
import {ResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
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
const Root: React.FC<PageLayoutProps> = ({
  containerWidth = 'xlarge',
  padding = 'normal',
  rowGap = 'normal',
  columnGap = 'normal',
  children,
  sx = {}
}) => {
  return (
    <PageLayoutContext.Provider value={{padding, rowGap, columnGap}}>
      <Box sx={merge<BetterSystemStyleObject>({padding: SPACING_MAP[padding]}, sx)}>
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
  variant?: 'none' | 'line'
  variantWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
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

const HorizontalDivider: React.FC<DividerProps> = ({variant = 'none', variantWhenNarrow = 'inherit', sx = {}}) => {
  const {padding} = React.useContext(PageLayoutContext)
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) =>
        merge<BetterSystemStyleObject>(
          {
            // Stretch divider to viewport edges on narrow screens
            marginX: negateSpacingValue(SPACING_MAP[padding]),
            ...horizontalDividerVariants[variantWhenNarrow === 'inherit' ? variant : variantWhenNarrow],
            [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
              marginX: '0 !important',
              ...horizontalDividerVariants[variant]
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

const VerticalDivider: React.FC<DividerProps> = ({variant = 'none', variantWhenNarrow = 'inherit', sx = {}}) => {
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) =>
        merge<BetterSystemStyleObject>(
          {
            height: '100%',
            ...verticalDividerVariants[variantWhenNarrow === 'inherit' ? variant : variantWhenNarrow],
            [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
              ...verticalDividerVariants[variant]
            }
          },
          sx
        )
      }
    />
  )
}

// ----------------------------------------------------------------------------
// PageLayout.Header

export type PageLayoutHeaderProps = {
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const Header: React.FC<PageLayoutHeaderProps> = ({
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
}) => {
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
      {children}
      <HorizontalDivider
        variant={divider}
        variantWhenNarrow={dividerWhenNarrow}
        sx={{marginTop: SPACING_MAP[rowGap]}}
      />
    </Box>
  )
}

Header.displayName = 'PageLayout.Header'

// ----------------------------------------------------------------------------
// PageLayout.Content

export type PageLayoutContentProps = {
  width?: keyof typeof contentWidths
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

// TODO: Account for pane width when centering content
const contentWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const Content: React.FC<PageLayoutContentProps> = ({width = 'full', hidden = false, children, sx = {}}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      as="main"
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
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
      <Box sx={{width: '100%', maxWidth: contentWidths[width], marginX: 'auto'}}>{children}</Box>
    </Box>
  )
}

Content.displayName = 'PageLayout.Content'

// ----------------------------------------------------------------------------
// PageLayout.Pane

export type PageLayoutPaneProps = {
  position?: keyof typeof panePositions
  positionWhenNarrow?: 'inherit' | keyof typeof panePositions
  width?: keyof typeof paneWidths
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
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

const Pane: React.FC<PageLayoutPaneProps> = ({
  position = 'end',
  positionWhenNarrow = 'inherit',
  width = 'medium',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  const {rowGap, columnGap} = React.useContext(PageLayoutContext)
  const computedPositionWhenNarrow = positionWhenNarrow === 'inherit' ? position : positionWhenNarrow
  const computedDividerWhenNarrow = dividerWhenNarrow === 'inherit' ? divider : dividerWhenNarrow
  return (
    <Box
      as="aside"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) =>
        merge<BetterSystemStyleObject>(
          {
            order: panePositions[computedPositionWhenNarrow],
            display: isHidden ? 'none' : 'flex',
            flexDirection: computedPositionWhenNarrow === 'end' ? 'column' : 'column-reverse',
            width: '100%',
            marginX: 0,
            [computedPositionWhenNarrow === 'end' ? 'marginTop' : 'marginBottom']: SPACING_MAP[rowGap],
            [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
              width: 'auto',
              [position === 'end' ? 'marginLeft' : 'marginRight']: SPACING_MAP[columnGap],
              marginY: `0 !important`,
              flexDirection: position === 'end' ? 'row' : 'row-reverse',
              order: panePositions[position]
            }
          },
          sx
        )
      }
    >
      {/* Show a horizontal divider when viewport is narrow. Otherwise, show a vertical divider. */}
      <HorizontalDivider
        variant="none"
        variantWhenNarrow={computedDividerWhenNarrow}
        sx={{[computedPositionWhenNarrow === 'end' ? 'marginBottom' : 'marginTop']: SPACING_MAP[rowGap]}}
      />
      <VerticalDivider
        variant={divider}
        variantWhenNarrow="none"
        sx={{[position === 'end' ? 'marginRight' : 'marginLeft']: SPACING_MAP[columnGap]}}
      />

      <Box sx={{width: paneWidths[width]}}>{children}</Box>
    </Box>
  )
}

Pane.displayName = 'PageLayout.Pane'

// ----------------------------------------------------------------------------
// PageLayout.Footer

export type PageLayoutFooterProps = {
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const Footer: React.FC<PageLayoutFooterProps> = ({
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
}) => {
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
      <HorizontalDivider
        variant={divider}
        variantWhenNarrow={dividerWhenNarrow}
        sx={{marginBottom: SPACING_MAP[rowGap]}}
      />
      {children}
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
