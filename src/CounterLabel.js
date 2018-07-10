import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function CounterLabel({theme, children}) {
  return <span className={classnames('Counter', theme && `Counter--${theme}`)}>{children}</span>
}

CounterLabel.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.oneOf(['gray', 'gray-light'])
}
