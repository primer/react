import React from 'react'
import {Box} from '..'

type PageLayoutProps = {
  /** The maximum width of the page container */
  containerWidth?: keyof typeof containerWidthMap
  /** The spacing between the outer edges of the page container and the viewport */
  outerSpacing?: keyof typeof spacingMap // Should this be called `padding`?
}

const containerWidthMap = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const spacingMap = {
  normal: [3, null, null, 4],
  condensed: 3
}

// TODO: refs
const Root: React.FC<PageLayoutProps> = ({containerWidth = 'xlarge', outerSpacing = 'normal', children}) => {
  return (
    <Box
      sx={{
        padding: spacingMap[outerSpacing]
      }}
    >
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
          rowGap: [3, null, null, 4],
          columnGap: [3, null, null, 4]
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
