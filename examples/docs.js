import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import Sandbox from './Sandbox'

const Index = props => (
  <div>
    <nav className='UnderlineNav'>
      <div className='UnderlineNav-body'>
        <NavLink to='/primer-react/docs/components' className='UnderlineNav-item no-underline'>primer-react</NavLink>
        <NavLink to='/primer-react/docs/demos' className='UnderlineNav-item no-underline'>Demos</NavLink>
        <NavLink to='/primer-react/docs/sandbox' className='UnderlineNav-item no-underline'>Sandbox</NavLink>
      </div>
    </nav>
    <Route path='/primer-react/docs/demos' component={DemoPage} />
    <Route path='/primer-react/docs/components' component={ComponentPage} />
    <Route path='/primer-react/docs/sandbox' component={Sandbox} />
  </div>
)

export default Index
