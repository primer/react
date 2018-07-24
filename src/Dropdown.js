import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Details from './Details'
import Button from './Button'
import {mapWhitespaceProps} from './props'

const arrowStyles = {
  content: '',
  border: '4px solid',
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderBottomColor: 'transparent',
  width: '0',
  height: '0'
}

const generateMenuItems = (children) => {
  return React.Children.map(children, child => {
    return React.cloneElement(child, {
      className: 'dropdown-menu-item'
    })
  })
}

export default function Dropdown({title, scheme, children, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  return (
      <Details autoClose>
        {({open, toggle}) => (
          <React.Fragment>
            <summary className="btn" onClick={toggle}>
              {title} <div className="d-inline-block v-align-middle" style={arrowStyles} />
            </summary>
            <div className="dropdown-menu dropdown-menu-se">
              {generateMenuItems(children)}
            </div>
          </React.Fragment>
        )}
      </Details>
  )
}

Dropdown.propTypes = {
  children: PropTypes.node,
  scheme: Button.propTypes.scheme,
  title: PropTypes.string
}
