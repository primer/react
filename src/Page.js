import Box from './Box'
import CSS from './CSS'
import Meta from './Meta'
import React from 'react'
import theme from './theme'
import {ThemeProvider} from 'styled-components'

// Generic page wrapper component
const Page = props => (
  <React.Fragment>
    <head>
      <title>Primer React</title>
      <Meta />
      <CSS />
    </head>
    <ThemeProvider theme={theme}>
      <body>
        <Box text='bodytext'>
          {props.children}
        </Box>
      </body>
    </ThemeProvider>
  </React.Fragment>
)

export default Page
