import Box from './Box'
import CSS from './CSS'
import Meta from './Meta'
import React from 'react'
import theme from './theme'
import {ThemeProvider} from 'styled-components'

// Generic page wrapper component
const Page = ({children}) => (
  <React.Fragment>
    <head>
      <title>Primer React</title>
      <Meta />
      <CSS />
    </head>
    <ThemeProvider theme={theme}>
      <div className='text-dark-gray'>
        {children}
      </div>
    </ThemeProvider>
  </React.Fragment>
)

export default Page
