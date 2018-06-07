import CSS from './CSS'
import Meta from './Meta'
import React from 'react'

// Generic page wrapper component
const Page = ({children}) => (
  <React.Fragment>
    <head>
      <Meta />
      <CSS />
    </head>
    <body className='text-dark-gray'>
      {children}
    </body>
  </React.Fragment>
)

export default Page
