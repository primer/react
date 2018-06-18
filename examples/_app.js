import CSS from './CSS'
import React from 'react'

// Generic page wrapper component
const Page = ({ render }) => (
  <React.Fragment>
    <CSS />
    <div className='text-dark-gray'>
      {render()}
    </div>
  </React.Fragment>
)

export default Page
