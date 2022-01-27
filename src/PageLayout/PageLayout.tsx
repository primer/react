import React from 'react'
import {Box} from '..'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4
}

// ----------------------------------------------------------------------------
// PageLayout

type PageLayoutProps = {
  /** The maximum width of the page container */
  containerWidth?: keyof typeof containerWidthMap
  /** The spacing between the outer edges of the page container and the viewport */
  outerSpacing?: keyof typeof spacingMap // Should this be called `padding`?
  rowGap?: keyof typeof spacingMap
  columnGap?: keyof typeof spacingMap
} & SxProp

const containerWidthMap = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const spacingMap = {
  // none: '0', Should `none` be an option?
  condensed: 3,
  normal: [3, null, null, 4]
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
    <Box sx={merge<BetterSystemStyleObject>({padding: spacingMap[outerSpacing]}, sx)}>
      <Box
        sx={{
          maxWidth: containerWidthMap[containerWidth],
          marginX: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: spacingMap[rowGap], // TODO: browser support
          columnGap: spacingMap[columnGap] // TODO: browser support
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

Root.displayName = 'PageLayout'

// ----------------------------------------------------------------------------
// PageLayout.Header

type PageLayoutHeaderProps = {
  // divider?: 'none' | 'line'
  // dividerWhenNarrow?: 'inherit' | 'none' | 'line' | 'filled'
}

// const dividerMap = {
//   none: {},
//   line: {
//     height: 1,
//     backgroundColor: 'border.default'
//   },
//   filled: {
//     height: 8,
//     backgroundColor: 'canvas.inset',
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     boxShadow: (theme: any) =>
//       `inset 0 -1px 0 0 ${theme.colors.border.default}, inset 0 1px 0 0 ${theme.colors.border.default}`
//   }
// }

const Header: React.FC<PageLayoutHeaderProps> = ({
  // divider = 'none',
  // dividerWhenNarrow = 'inherit',
  children
}) => {
  return (
    <Box
      sx={{
        order: REGION_ORDER.header,
        width: '100%'
        // display: 'grid',
        // gap: [3, null, 4]
      }}
    >
      {children}
      {/* <Box
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sx={(theme: any) => ({
          // marginTop: 3,
          marginX: -3,
          ...dividerMap[dividerWhenNarrow === 'inherit' ? divider : dividerWhenNarrow],
          [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
            // marginTop: 4,
            marginX: 0,
            ...dividerMap[divider]
          }
        })}
      /> */}
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
  children
}) => {
  return (
    <Box
      sx={{
        order: [
          panePositionMap[positionWhenNarrow === 'inherit' ? position : positionWhenNarrow],
          null,
          panePositionMap[position]
        ],
        width: paneWidthMap[width]
      }}
    >
      {children}
    </Box>
  )
}

Pane.displayName = 'PageLayout.Pane'

// ----------------------------------------------------------------------------
// PageLayout.Footer

const Footer: React.FC = ({children}) => {
  return <Box sx={{order: REGION_ORDER.footer, width: '100%'}}>{children}</Box>
}

Footer.displayName = 'PageLayout.Footer'

export const PageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
})
