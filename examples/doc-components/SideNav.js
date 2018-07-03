import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {Block} from '../../src'

const SideNav = ({title, examples}) => (
  <Block>
    <nav className="menu">
      <NavLink to={'/'} className="menu-heading no-underline link-gray-dark">
        {title}
      </NavLink>
      {examples.map(example => (
        <NavLink
          className="menu-item no-underline link-gray-dark"
          activeClassName="selected"
          to={`/${example.name}`}
          key={example.name}
        >
          {example.name}
        </NavLink>
      ))}
    </nav>
  </Block>
)

SideNav.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  title: PropTypes.node
}

export default SideNav
