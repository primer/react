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
            <NavLink to='/docs/primer-react' className='tabnav-tab' activeClassName='selected'>primer-react</NavLink>
            <NavLink to='/docs/demos' className='tabnav-tab' activeClassName='selected'>Demos</NavLink>
            <NavLink to='/docs/sandbox' className='tabnav-tab' activeClassName='selected'>Sandbox</NavLink>
          </nav>
        </div>
        <Route path='/docs/demos' component={DemoPage} />
        <Route path='/docs/primer-react' component={ComponentPage} />
        <Route path='/docs/sandbox' component={SandboxPage} />
      </div>
    </Router>
  </Page>
)

export default Index
