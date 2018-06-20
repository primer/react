import React from 'react'
import classnames from 'classnames'
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'

import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import Sandbox from './Sandbox'

const Index = props => (
  <div>
    <nav className='UnderlineNav'>
      <div className='UnderlineNav-body'>
        <NavLink to='/components' className='UnderlineNav-item no-underline' activeClassName='selected'>primer-react</NavLink>
        <NavLink to='/demos' className='UnderlineNav-item no-underline' activeClassName='selected'>Demos</NavLink>
        <NavLink to='/sandbox' className='UnderlineNav-item no-underline' activeClassName='selected'>Sandbox</NavLink>
      </div>
    </nav>
    <Route path='/demos' component={DemoPage} />
    <Route path='/components' component={ComponentPage} />
    <Route path='/sandbox' component={Sandbox} />
  </div>
)

export default Index
