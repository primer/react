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
    <body>
      <ThemeProvider theme={theme}>
        <div className='text-dark-gray'>
          {children}
        </div>
      </ThemeProvider>
    </body>
  </React.Fragment>
)

export default Page
