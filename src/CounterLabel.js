import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const CounterLabel = ({theme, children}) => (
  <span className={classnames('Counter', theme ? `Counter--${theme}` : null)}>{children}</span>
)

CounterLabel.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.oneOf(['gray', 'gray-light'])
}

export default CounterLabel
