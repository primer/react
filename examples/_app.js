import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import Styles from './doc-components/Styles'
import {UnderlineNav, UnderlineNavItem} from '../src'

export default function Page({render}) {
  return (
    <React.Fragment>
      <Styles />
      <div className="text-dark-gray">
        <UnderlineNav>
          <UnderlineNavItem tag={NavLink} to="/components">
            Components
          </UnderlineNavItem>
          <UnderlineNavItem tag={NavLink} to="/demos">
            Demos
          </UnderlineNavItem>
          <UnderlineNavItem tag={NavLink} to="/sandbox">
            Sandbox
          </UnderlineNavItem>
        </UnderlineNav>
        {render()}
      </div>
    </React.Fragment>
  )
}

Page.propTypes = {
  render: PropTypes.func
}
