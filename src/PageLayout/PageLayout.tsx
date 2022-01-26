import React from 'react'
import {Box} from '..'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'

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
  small: 3,
  medium: [3, null, null, 4]
}

// TODO: refs
const Root: React.FC<PageLayoutProps> = ({
  containerWidth = 'xlarge',
  outerSpacing = 'medium',
  rowGap = 'medium',
  columnGap = 'medium',
  sx = {},
  children
}) => {
  return (
    <Box sx={merge<BetterSystemStyleObject>({padding: spacingMap[outerSpacing]}, sx)}>
      <Box
        sx={{
          maxWidth: containerWidthMap[containerWidth],
          marginX: 'auto',
          display: 'grid',
          gridTemplateAreas: [
            `"header header" "content content" "pane pane" "footer footer"`,
            null,
            `"header header" "content pane" "footer footer"`
          ],
          gridTemplateColumns: '1fr auto',
          rowGap: spacingMap[rowGap],
          columnGap: spacingMap[columnGap]
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
  return <Box sx={{gridArea: 'header'}}>{children}</Box>
}

Header.displayName = 'PageLayout.Header'

// PageLayout.Content

const Content: React.FC = ({children}) => {
  return <Box sx={{gridArea: 'content'}}>{children}</Box>
}

Content.displayName = 'PageLayout.Content'

// ----------------------------------------------------------------------------
// PageLayout.Pane

const Pane: React.FC = ({children}) => {
  return (
    <Box
      sx={{
        gridArea: 'pane',
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
  return <Box sx={{gridArea: 'footer'}}>{children}</Box>
}

Footer.displayName = 'PageLayout.Footer'

export const PageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
})
