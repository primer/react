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

const Index = props => (
  <Page>
    <Router>
      <div>
        <div className='tabnav'>
          <nav className='tabnav-tabs'>
            <NavLink to='/demos' className='tabnav-tab' activeClassName='selected'>Demos</NavLink>
            <NavLink to='/primer-react' className='tabnav-tab' activeClassName='selected'>primer-react</NavLink>
          </nav>
        </div>
        <Route path='/demos' component={DemoPage} />
        <Route path='/primer-react' component={ComponentPage} />
      </div>
    </Router>
  </Page>
)

export default Index
