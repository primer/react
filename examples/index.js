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
        <NavLink to='/primer-react/primer-react' className='UnderlineNav-item no-underline' activeClassName='selected'>primer-react</NavLink>
        <NavLink to='/primer-react/demos' className='UnderlineNav-item no-underline' activeClassName='selected'>Demos</NavLink>
        <NavLink to='/primer-react/sandbox' className='UnderlineNav-item no-underline' activeClassName='selected'>Sandbox</NavLink>
      </div>
    </nav>
    <Route path='/primer-react/demos' component={DemoPage} />
    <Route path='/primer-react/primer-react' component={ComponentPage} />
    <Route path='/primer-react/sandbox' component={Sandbox} />
  </div>
)

export default Index
