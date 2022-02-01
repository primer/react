import React from 'react'
import {Box} from '..'
import {BetterSystemStyleObject, merge, SxProp} from '../sx'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4
}

const SPACING_MAP = {
  // none: '0', Should `none` be an option?
  condensed: 3,
  normal: [3, null, null, 4]
}

const PageLayoutContext = React.createContext<{
  outerSpacing: keyof typeof SPACING_MAP
  rowGap: keyof typeof SPACING_MAP
  columnGap: keyof typeof SPACING_MAP
}>({
  outerSpacing: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
})

// ----------------------------------------------------------------------------
// PageLayout

type PageLayoutProps = {
  /** The maximum width of the page container */
  containerWidth?: keyof typeof containerWidthMap
  /** The spacing between the outer edges of the page container and the viewport */
  outerSpacing?: keyof typeof SPACING_MAP // Should this be called `padding`?
  rowGap?: keyof typeof SPACING_MAP
  columnGap?: keyof typeof SPACING_MAP
} & SxProp

const containerWidthMap = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

// TODO: refs
const Root: React.FC<PageLayoutProps> = ({
  containerWidth = 'xlarge',
  outerSpacing = 'normal',
  rowGap = 'normal',
  columnGap = 'normal',
  sx = {},
  children
}) => {
  return (
    <PageLayoutContext.Provider value={{outerSpacing, rowGap, columnGap}}>
      <Box sx={merge<BetterSystemStyleObject>({padding: SPACING_MAP[outerSpacing]}, sx)}>
        <Box
          sx={{
            maxWidth: containerWidthMap[containerWidth],
            marginX: 'auto',
            display: 'flex',
            flexWrap: 'wrap'
            // rowGap: SPACING_MAP[rowGap], // TODO: browser support
            // columnGap: SPACING_MAP[columnGap] // TODO: browser support
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
}

const horizontalDividerStyles = {
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
    return value.map(v => (v === null ? null : -v))
  }

  return value === null ? null : -value
}

const HorizontalDivider: React.FC<DividerProps> = ({variant = 'none', variantWhenNarrow = 'inherit'}) => {
  const {outerSpacing} = React.useContext(PageLayoutContext)
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) => ({
        // Srtetch divider to viewport edges on narrow screens
        marginX: negateSpacingValue(SPACING_MAP[outerSpacing]),
        ...horizontalDividerStyles[variantWhenNarrow === 'inherit' ? variant : variantWhenNarrow],
        [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
          marginX: '0 !important',
          ...horizontalDividerStyles[variant]
        }
      })}
    />
  )
}

const verticalDividerStyles = {
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

const VerticalDivider: React.FC<DividerProps> = ({variant = 'none', variantWhenNarrow = 'inherit'}) => {
  return (
    <Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) => ({
        height: '100%',
        ...verticalDividerStyles[variantWhenNarrow === 'inherit' ? variant : variantWhenNarrow],
        [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
          ...verticalDividerStyles[variant]
        }
      })}
    />
  )
}

// ----------------------------------------------------------------------------
// PageLayout.Header

type PageLayoutHeaderProps = {
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
}

const Header: React.FC<PageLayoutHeaderProps> = ({divider = 'none', dividerWhenNarrow = 'inherit', children}) => {
  return (
    <Box
      sx={{
        order: REGION_ORDER.header,
        width: '100%'
      }}
    >
      {children}
      <HorizontalDivider variant={divider} variantWhenNarrow={dividerWhenNarrow} />
    </Box>
  )
}

Header.displayName = 'PageLayout.Header'

// ----------------------------------------------------------------------------
// PageLayout.Content

type PageLayoutContentProps = {
  width?: keyof typeof contentWidthMap
}

// TODO: Account for pane width when centering content
const contentWidthMap = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const Content: React.FC<PageLayoutContentProps> = ({width = 'full', children}) => {
  return (
    <Box sx={{order: REGION_ORDER.content, flexGrow: 1}}>
      <Box sx={{maxWidth: contentWidthMap[width], marginX: 'auto'}}>{children}</Box>
    </Box>
  )
}

Content.displayName = 'PageLayout.Content'

// ----------------------------------------------------------------------------
// PageLayout.Pane

type PageLayoutPaneProps = {
  position?: keyof typeof panePositionMap
  positionWhenNarrow?: 'inherit' | keyof typeof panePositionMap
  width?: keyof typeof paneWidthMap
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
}

const panePositionMap = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd
}

const paneWidthMap = {
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
  children
}) => {
  const computedPositionWhenNarrow = positionWhenNarrow === 'inherit' ? position : positionWhenNarrow
  const computedDividerWhenNarrow = dividerWhenNarrow === 'inherit' ? divider : dividerWhenNarrow
  return (
    <Box
      sx={{
        order: [panePositionMap[computedPositionWhenNarrow], null, panePositionMap[position]],
        display: 'flex',
        flexDirection: [
          computedPositionWhenNarrow === 'end' ? 'column' : 'column-reverse',
          null,
          position === 'end' ? 'row' : 'row-reverse'
        ],
        width: ['100%', null, 'auto']
      }}
    >
      {/* Show a horiztonal divider when viewport is narrow. Otherwise, show a vertical divider. */}
      <HorizontalDivider variant="none" variantWhenNarrow={computedDividerWhenNarrow} />
      <VerticalDivider variant={divider} variantWhenNarrow="none" />

      <Box sx={{width: paneWidthMap[width]}}>{children}</Box>
    </Box>
  )
}

Pane.displayName = 'PageLayout.Pane'

// ----------------------------------------------------------------------------
// PageLayout.Footer

type PageLayoutFooterProps = {
  divider?: 'none' | 'line'
  dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
}

const Footer: React.FC<PageLayoutFooterProps> = ({divider = 'none', dividerWhenNarrow = 'inherit', children}) => {
  return (
    <Box
      sx={{
        order: REGION_ORDER.footer,
        width: '100%'
      }}
    >
      <HorizontalDivider variant={divider} variantWhenNarrow={dividerWhenNarrow} />
      {children}
    </Box>
  )
}

Footer.displayName = 'PageLayout.Footer'

// ----------------------------------------------------------------------------

export const PageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
})
