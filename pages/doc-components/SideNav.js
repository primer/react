import React from 'react'
import {Button, Link} from '../../src'

const SideNav = () =>
  <React.Fragment>
    <nav className="menu">
      <span className="menu-heading">Components</span>
      <Link pl={4} className="menu-item" href="/components/avatar">Avatar</Link>
    </nav>
  </React.Fragment>

export default SideNav
