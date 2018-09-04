import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {Box, Relative} from '../../src'

export default function SideNav({basename, title, examples, ...rest}) {
  return (
    <Relative p={4} {...rest}>
      <nav className="menu">
        <NavLink to={basename} className="menu-heading no-underline link-gray-dark">
          {title}
        </NavLink>
        {examples.map(example => (
          <NavLink
            className="menu-item no-underline link-gray-dark"
            activeClassName="selected"
            to={example.path}
            key={example.name}
          >
            {example.name}
          </NavLink>
        ))}
      </nav>
    </Relative>
  )
}

SideNav.defaultProps = {
  minWidth: '10em'
}

SideNav.propTypes = {
  basename: PropTypes.string,
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      element: PropTypes.element,
      name: PropTypes.string,
      path: PropTypes.string
    })
  ),
  title: PropTypes.node
}
