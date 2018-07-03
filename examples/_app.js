import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {default as CSSStyles} from './doc-components/CSS'

const Page = ({render}) => (
  <React.Fragment>
    <CSSStyles />
    <div className="text-dark-gray">
      <nav className="UnderlineNav">
        <div className="UnderlineNav-body">
          <NavLink to="/components" className="UnderlineNav-item no-underline" activeClassName="selected">
            primer-react
          </NavLink>
          <NavLink to="/demos" className="UnderlineNav-item no-underline" activeClassName="selected">
            Demos
          </NavLink>
          <NavLink to="/sandbox" className="UnderlineNav-item no-underline" activeClassName="selected">
            Sandbox
          </NavLink>
        </div>
      </nav>
      {render()}
    </div>
  </React.Fragment>
)

Page.propTypes = {
  render: PropTypes.func
}

export default Page
