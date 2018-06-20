import React from 'react'
import classnames from 'classnames'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import Sandbox from './Sandbox'

const Index = props => (
  <Router>
    <div>
      <nav className='UnderlineNav'>
        <div className='UnderlineNav-body'>
          <Link to='/docs/primer-react' className='UnderlineNav-item no-underline' activeClassName='selected'>primer-react</Link>
          <Link to='/docs/demos' className='UnderlineNav-item no-underline' activeClassName='selected'>Demos</Link>
          <Link to='/docs/sandbox' className='UnderlineNav-item no-underline' activeClassName='selected'>Sandbox</Link>
        </div>
      </nav>
      <Route path='/docs/demos' component={DemoPage} />
      <Route path='/docs/primer-react' component={ComponentPage} />
      <Route path='/docs/sandbox' component={Sandbox} />
    </div>
  </Router>
)

export default Index
