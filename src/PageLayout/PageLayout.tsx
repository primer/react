import React from 'react'
import {Box} from '..'

// TODO: refs
const Root: React.FC = ({children}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: `"header header" "content pane" "footer footer"`,
        gridTemplateColumns: '1fr auto',
        padding: 4,
        rowGap: 4,
        columnGap: 4
      }}
    >
      {children}
    </Box>
  )
}

Root.displayName = 'PageLayout'

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

// PageLayout.Pane

const Pane: React.FC = ({children}) => {
  return <Box sx={{gridArea: 'pane'}}>{children}</Box>
}

Pane.displayName = 'PageLayout.Pane'

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
