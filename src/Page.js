import React from 'react'
import theme from './theme'
import Meta from './Meta'
import Box from './Box'

// Generic page wrapper component
const Page = props => (
  <React.Fragment>
    <head>
      <title>Primer React</title>
      <Meta />
    </head>
    <div className='text-body'>
      {props.children}
    </div>
  </React.Fragment>
)

export default Page
