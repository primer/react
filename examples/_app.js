import CSS from './CSS'
import React from 'react'
import Index from './docs'

// Generic page wrapper component
const Page = ({ render }) => (
  <React.Fragment>
    <CSS />
    <div className='text-dark-gray'>
    <Index/>
      {render()}
    </div>
  </React.Fragment>
)

export default Page
