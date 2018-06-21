import React from 'react'
import { Route, Link } from 'react-router-dom'
import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import Sandbox from './Sandbox'

const Index = props => (
  <div>
    <nav className='UnderlineNav'>
      <div className='UnderlineNav-body'>
        <Link to='/docs/components' className='UnderlineNav-item no-underline'>primer-react</Link>
        <Link to='/docs/demos' className='UnderlineNav-item no-underline'>Demos</Link>
        <Link to='/docs/sandbox' className='UnderlineNav-item no-underline'>Sandbox</Link>
      </div>
    </nav>
    <Route path='/docs/demos' component={DemoPage} />
    <Route path='/docs/components' component={ComponentPage} />
    <Route path='/docs/sandbox' component={Sandbox} />
  </div>
)

export default Index
