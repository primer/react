import React from 'react'
import classnames from 'classnames'
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'

import Page from './Page'
import DemoPage from './DemoPage'
import ComponentPage from './ComponentPage'
import SandboxPage from './SandboxPage'

const Index = props => (
  <Page>
    <Router>
      <div>
        <div className='tabnav'>
          <nav className='tabnav-tabs'>
            <NavLink to='/primer-react' className='tabnav-tab' activeClassName='selected'>primer-react</NavLink>
            <NavLink to='/demos' className='tabnav-tab' activeClassName='selected'>Demos</NavLink>
            <NavLink to='/sandbox' className='tabnav-tab' activeClassName='selected'>Sandbox</NavLink>
          </nav>
        </div>
        <Route path='/demos' component={DemoPage} />
        <Route path='/primer-react' component={ComponentPage} />
        <Route path='/sandbox' component={SandboxPage} />
      </div>
    </Router>
  </Page>
)

export default Index
