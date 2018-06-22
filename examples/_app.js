import React from 'react'
import { NavLink } from 'react-router-dom'
import CSS from './doc-components/CSS'
import Index from 'index.js'

const Page = ({ render }) => (
  <React.Fragment>
    <CSS />
    <div className='text-dark-gray'>
      <nav className='UnderlineNav'>
        <div className='UnderlineNav-body'>
          <NavLink to='/components' className='UnderlineNav-item no-underline' activeClassName='selected'>primer-react</NavLink>
          <NavLink to='/demos' className='UnderlineNav-item no-underline' activeClassName='selected'>Demos</NavLink>
          <NavLink to='/sandbox' className='UnderlineNav-item no-underline' activeClassName='selected'>Sandbox</NavLink>
        </div>
      </nav>
      <Index />
    </div>
  </React.Fragment>
)

export default Page
