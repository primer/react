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
  condensed: 3,
  normal: [3, null, 4]
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

const Header: React.FC = ({children}) => {
  return <Box sx={{order: REGION_ORDER.header, width: '100%'}}>{children}</Box>
}

Header.displayName = 'PageLayout.Header'

// ----------------------------------------------------------------------------

// PageLayout.Content

const Content: React.FC = ({children}) => {
  return <Box sx={{order: REGION_ORDER.content, flexGrow: 1}}>{children}</Box>
}

Content.displayName = 'PageLayout.Content'

// ----------------------------------------------------------------------------
// PageLayout.Pane

type PageLayoutPaneProps = {
  position?: keyof typeof panePositionMap
  positionWhenNarrow?: 'inherit' | keyof typeof panePositionMap
}

const panePositionMap = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd
}

const Pane: React.FC<PageLayoutPaneProps> = ({position = 'end', positionWhenNarrow = 'inherit', children}) => {
  return (
    <Box
      sx={{
        order: [
          panePositionMap[positionWhenNarrow === 'inherit' ? position : positionWhenNarrow],
          null,
          panePositionMap[position]
        ],
        width: ['100%', null, '296px']
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
