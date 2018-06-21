import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import Sandbox from './Sandbox'

const Index = props => (
  <div>
    <nav className='UnderlineNav'>
      <div className='UnderlineNav-body'>
        <NavLink to='/docs/primer-react' className='UnderlineNav-item no-underline' activeClassName='selected'>primer-react</NavLink>
        <NavLink to='/docs/demos' className='UnderlineNav-item no-underline' activeClassName='selected'>Demos</NavLink>
        <NavLink to='/docs/sandbox' className='UnderlineNav-item no-underline' activeClassName='selected'>Sandbox</NavLink>
      </div>
    </nav>
    <Route path='/docs/demos' component={DemoPage} />
    <Route path='/docs/primer-react' component={ComponentPage} />
    <Route path='/docs/sandbox' component={Sandbox} />
  </div>
)

export default Index
